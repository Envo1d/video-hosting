const { test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const { once } = require('node:events')
const { randomUUID } = require('node:crypto')
const fs = require('node:fs/promises')
const path = require('node:path')
const sharp = require('sharp')

// Fixed isolated services: never inherit development database credentials.
Object.assign(process.env, {
	NODE_ENV: 'test', PORT: '17000', APP_URL: 'http://127.0.0.1:17000',
	NODE_CONFIG: '{}', NODE_CONFIG_DIR: path.resolve('build/config'),
	POSTGRES_HOST: '127.0.0.1', POSTGRES_PORT: '16500', POSTGRES_USER: 'test',
	POSTGRES_PASSWORD: 'test', POSTGRES_DB: 'video_hosting_test',
	REDIS_URL: 'redis://127.0.0.1:16379',
	JWT_ACCESS_TOKEN_KEY: 'integration-test-access-key', JWT_REFRESH_TOKEN_KEY: 'integration-test-refresh-key',
	UPLOAD_DIR: path.resolve('tmp', `api-test-${randomUUID()}`)
})
const { AppDataSource: db } = require('../build/src/utils/data-source')
const base = process.env.APP_URL
const users = []
let server, output = '', png, video, postId, likeId, commentId

async function request(route, { method = 'GET', body, user, token, form, status = 200 } = {}) {
	const headers = {}
	if (user?.cookie) headers.cookie = user.cookie
	if (token) headers.authorization = `Bearer ${token}`
	if (body) headers['content-type'] = 'application/json'
	const response = await fetch(`${base}/api${route}`, {
		method, headers, body: form || (body && JSON.stringify(body)), signal: AbortSignal.timeout(10000)
	})
	const result = await response.json()
	assert.equal(response.status, status, `${method} ${route}: ${JSON.stringify(result)}`)
	return { response, body: result }
}

function cookie(response) {
	return response.headers.getSetCookie().map(value => value.split(';')[0]).join('; ')
}

function upload({ includeVideo = true, includeIcon = true, title = 'Integration video' } = {}) {
	const form = new FormData()
	if (includeVideo) form.set('file', new Blob([video], { type: 'video/mp4' }), 'video.mp4')
	if (includeIcon) form.set('icon', new Blob([png], { type: 'image/png' }), 'icon.png')
	if (title) form.set('title', title)
	form.set('description', 'Integration test upload')
	return form
}

before(async () => {
	assert.equal(db.options.database, 'video_hosting_test')
	assert.equal(Number(db.options.port), 16500)
	await db.initialize()
	await db.runMigrations()
	png = await sharp({ create: { width: 16, height: 16, channels: 3, background: '#ff0000' } }).png().toBuffer()
	video = await fs.readFile(path.resolve('../client/public/water.mp4'))
	server = spawn(process.execPath, ['build/src/app.js'], { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] })
	server.stdout.on('data', data => { output += data })
	server.stderr.on('data', data => { output += data })
	for (let attempt = 0; attempt < 100; attempt++) {
		if (server.exitCode !== null) throw new Error(output)
		try {
			const response = await fetch(`${base}/api/healthchecker`, { signal: AbortSignal.timeout(1000) })
			if (response.ok) return
		} catch {}
		await new Promise(resolve => setTimeout(resolve, 100))
	}
	throw new Error(`Server did not start: ${output}`)
}, { timeout: 30000 })

after(async () => {
	if (server && server.exitCode === null) {
		const stopped = once(server, 'exit')
		server.kill()
		await stopped
	}
	if (db.isInitialized) {
		const ids = users.filter(user => user.id).map(user => user.id)
		if (ids.length) {
			await db.query('DELETE FROM subscriptions WHERE "subscriberId" = ANY($1::uuid[]) OR "subscribedToId" = ANY($1::uuid[])', [ids])
			await db.query('DELETE FROM users WHERE id = ANY($1::uuid[])', [ids])
		}
		await db.destroy()
	}
	// This path is exclusively created for this run.
	assert.equal(path.dirname(process.env.UPLOAD_DIR), path.resolve('tmp'))
	await fs.rm(process.env.UPLOAD_DIR, { recursive: true, force: true })
})

test('health, CORS, unknown routes and unauthenticated access', async () => {
	assert.equal((await request('/healthchecker')).body.status, 'success')
	await request('/missing', { status: 404 })
	for (const route of ['/users/me', '/auth/logout', '/global/get-random-users', '/subscription/following-posts']) {
		await request(route, { status: 401 })
	}
	const cors = await fetch(`${base}/api/users/me`, { method: 'OPTIONS', headers: { origin: 'http://localhost:3000', 'access-control-request-method': 'GET' } })
	assert.equal(cors.headers.get('access-control-allow-origin'), 'http://localhost:3000')
	assert.equal(cors.headers.get('access-control-allow-credentials'), 'true')
})

test('Zod validation returns field issues', async () => {
	const result = await request('/auth/register', { method: 'POST', body: {}, status: 400 })
	assert.ok(result.body.errors.some(issue => issue.path.includes('email')))
	await request('/auth/register', { method: 'POST', body: { name: 'Test', nickname: 'test', email: 'invalid', password: 'password123', passwordConfirm: 'different' }, status: 400 })
	await request('/auth/login', { method: 'POST', body: { email: 'bad', password: '' }, status: 400 })
})

test('registration, password hashing, duplicate registration and login', async () => {
	for (let i = 0; i < 2; i++) {
		const suffix = randomUUID().replaceAll('-', '')
		const user = { name: `Test ${i}`, nickname: `test${suffix}`, email: `${suffix}@example.com`, password: 'password123', passwordConfirm: 'password123' }
		const registered = await request('/auth/register', { method: 'POST', body: user, status: 201 })
		user.cookie = cookie(registered.response)
		assert.match(user.cookie, /refresh_token=/)
		user.id = (await request('/users/me', { user })).body.id
		users.push(user)
		const [stored] = await db.query('SELECT password FROM users WHERE id = $1', [user.id])
		assert.match(stored.password, /^\$argon2/)
		await request('/auth/register', { method: 'POST', body: user, status: 409 })
		await request('/auth/login', { method: 'POST', body: { email: user.email, password: 'wrongpassword' }, status: 400 })
		const login = await request('/auth/login', { method: 'POST', body: user })
		assert.ok(login.body.access_token)
		user.cookie = cookie(login.response)
	}
})

test('refresh tokens and rejected invalid credentials', async () => {
	assert.ok((await request('/auth/refresh', { user: users[0] })).body.access_token)
	await request('/auth/refresh', { status: 403 })
	await request('/auth/refresh', { user: { cookie: 'refresh_token=invalid' }, status: 403 })
	await request('/users/me', { user: { cookie: 'access_token=invalid' }, status: 401 })
	const token = users[0].cookie.match(/access_token=([^;]+)/)[1]
	assert.equal((await request('/users/me', { token })).body.id, users[0].id)
	const expired = require('jsonwebtoken').sign({ sub: users[0].id }, process.env.JWT_ACCESS_TOKEN_KEY, { expiresIn: -1 })
	await request('/users/me', { token: expired, status: 401 })
})

test('profile updates and public profile lookup', async () => {
	await request('/users/update-profile', { method: 'POST', user: users[0], body: { name: 'Updated tester', bio: 'Integration bio' } })
	const me = (await request('/users/me', { user: users[0] })).body
	assert.equal(me.name, 'Updated tester')
	assert.equal(me.bio, 'Integration bio')
	const profile = (await request(`/profile?link=${users[0].nickname}`)).body
	assert.equal(profile.user.id, users[0].id)
	assert.equal(profile.user.name, me.name)
	await request('/users/update-profile', { method: 'POST', user: users[0], body: { name: '' }, status: 400 })
})

test('video and icon upload, static media and post retrieval', async () => {
	await request('/posts', { method: 'POST', user: users[0], form: upload() })
	const home = (await request('/global/home')).body
	const post = home.posts.find(post => post.user.id === users[0].id)
	assert.ok(post)
	postId = post.id
	assert.equal(post.title, 'Integration video')
	assert.equal((await fetch(post.videoUrl)).status, 200)
	const icon = await fetch(post.iconUrl)
	assert.deepEqual(Buffer.from(await icon.arrayBuffer()), png)
	const shown = (await request(`/posts?id=${postId}`)).body
	assert.equal(shown.post.id, postId)
	assert.ok(shown.ids.includes(postId))
	const byUser = (await request(`/posts/get-by-id?userId=${users[0].id}`)).body
	assert.ok(byUser.posts.some(post => post.id === postId))
})

test('incomplete and invalid uploads return 400 and clean up files', async () => {
	const before = await fs.readdir(path.join(process.env.UPLOAD_DIR, 'videos'))
	for (const options of [{ includeVideo: false }, { includeIcon: false }, { title: '' }]) {
		await request('/posts', { method: 'POST', user: users[0], form: upload(options), status: 400 })
	}
	const form = new FormData()
	form.set('file', new Blob(['bad'], { type: 'text/plain' }), 'bad.txt')
	await request('/posts', { method: 'POST', user: users[0], form, status: 400 })
	assert.deepEqual(await fs.readdir(path.join(process.env.UPLOAD_DIR, 'videos')), before)
})

test('avatar crop, replacement, invalid crop and background uploads', async () => {
	for (const route of ['/users/upload-image', '/users/upload-back-image']) {
		for (let i = 0; i < 2; i++) {
			const form = new FormData()
			form.set('file', new Blob([png], { type: 'image/png' }), 'avatar.png')
			for (const [key, value] of Object.entries({ left: '0', top: '0', width: '8', height: '8' })) form.set(key, value)
			await request(route, { method: 'POST', user: users[0], form })
			const me = (await request('/users/me', { user: users[0] })).body
			const url = route.endsWith('upload-image') ? me.image : me.backgroundImage
			const response = await fetch(url)
			assert.equal(response.status, 200)
			const metadata = await sharp(Buffer.from(await response.arrayBuffer())).metadata()
			assert.equal(metadata.width, route.endsWith('upload-image') ? 8 : 16)
		}
	}
	const form = new FormData()
	form.set('file', new Blob([png], { type: 'image/png' }), 'badcrop.png')
	await request('/users/upload-image', { method: 'POST', user: users[0], form, status: 400 })
})

test('image upload limits, missing files, corrupt images and unexpected fields', async () => {
	await request('/users/upload-image', { method: 'POST', user: users[0], body: {}, status: 400 })
	await request('/users/upload-back-image', { method: 'POST', user: users[0], body: {}, status: 400 })
	const oversized = new FormData()
	oversized.set('file', new Blob([Buffer.alloc(10 * 1024 * 1024 + 1)], { type: 'image/png' }), 'large.png')
	await request('/users/upload-image', { method: 'POST', user: users[0], form: oversized, status: 413 })
	const corrupt = new FormData()
	corrupt.set('file', new Blob(['not-an-image'], { type: 'image/png' }), 'corrupt.png')
	for (const [key, value] of Object.entries({ left: '0', top: '0', width: '8', height: '8' })) corrupt.set(key, value)
	await request('/users/upload-image', { method: 'POST', user: users[0], form: corrupt, status: 400 })
	const unexpected = new FormData()
	unexpected.set('unexpected', new Blob([png], { type: 'image/png' }), 'image.png')
	await request('/users/upload-back-image', { method: 'POST', user: users[0], form: unexpected, status: 400 })
})

test('likes and comments persist and appear on posts', async () => {
	const liked = await request('/likes', { method: 'POST', user: users[1], body: { postId } })
	likeId = liked.body.like.id
	await request('/comments', { method: 'POST', user: users[1], body: { postId, text: 'Test comment' } })
	const post = (await request(`/posts?id=${postId}`)).body.post
	assert.ok(post.likes.some(like => like.id === likeId))
	const comment = post.comments.find(comment => comment.text === 'Test comment')
	assert.ok(comment)
	commentId = comment.id
	await request('/likes', { method: 'DELETE', user: users[0], body: { id: likeId }, status: 403 })
	await request('/comments', { method: 'DELETE', user: users[0], body: { id: commentId }, status: 404 })
	await request('/likes', { method: 'POST', user: users[1], body: {}, status: 400 })
	await request('/comments', { method: 'POST', user: users[1], body: {}, status: 400 })
})

test('follow, recommendations, following feed and unfollow', async () => {
	await request('/subscription', { method: 'POST', user: users[1], body: { id: users[0].id } })
	const me = (await request('/users/me', { user: users[1] })).body
	assert.ok(me.subscriptions.includes(users[0].id))
	const author = (await request(`/profile?link=${users[0].nickname}`)).body
	assert.equal(author.user.subscribers, 1)
	const feed = (await request('/subscription/following-posts', { user: users[1] })).body
	assert.ok(feed.posts.some(post => post.id === postId))
	const recommendations = (await request('/global/get-random-users', { user: users[1] })).body
	const following = (await request('/subscription/following', { user: users[1] })).body
	assert.ok(following.users.some(user => user.id === users[0].id))
	assert.ok(following.users.every(user => !('password' in user) && !('email' in user)))
	const followers = (await request('/subscription/followers', { user: users[0] })).body
	assert.ok(followers.users.some(user => user.id === users[1].id))
	assert.ok(followers.users.every(user => !('password' in user) && !('email' in user)))
	assert.ok(recommendations.following.some(user => user.id === users[0].id))
	assert.ok(!recommendations.suggested.some(user => user.id === users[0].id))
	await request('/subscription', { method: 'DELETE', user: users[1], body: { id: users[0].id } })
	assert.deepEqual((await request('/subscription/following-posts', { user: users[1] })).body.posts, [])
})

test('random feed, excluded posts and repost counter', async () => {
	assert.ok((await request('/global/random')).body.posts.some(post => post.id === postId))
	assert.ok(!(await request(`/global/random?exclude=${postId}`)).body.posts.some(post => post.id === postId))
	await request(`/posts?id=${postId}`, { method: 'PUT', user: users[1] })
	const [post] = await db.query('SELECT reposts FROM posts WHERE id = $1', [postId])
	assert.equal(post.reposts, 1)
})

test('remove like, comment and post; reject post deletion by another user', async () => {
	await request('/likes', { method: 'DELETE', user: users[1], body: { id: likeId } })
	await request('/comments', { method: 'DELETE', user: users[1], body: { id: commentId } })
	const post = (await request(`/posts?id=${postId}`)).body.post
	assert.equal(post.likes.length, 0)
	assert.equal(post.comments.length, 0)
	await request(`/posts?id=${postId}`, { method: 'DELETE', user: users[1], status: 404 })
	await request(`/posts?id=${postId}`, { method: 'DELETE', user: users[0] })
	assert.equal((await fetch(post.videoUrl)).status, 404)
	assert.equal((await fetch(post.iconUrl)).status, 404)
	await request(`/posts?id=${postId}`, { status: 400 })
})

test('logout clears cookies and invalidates Redis sessions', async () => {
	for (const user of users) {
		const result = await request('/auth/logout', { user })
		assert.ok(result.response.headers.getSetCookie().some(cookie => cookie.startsWith('access_token=;')))
		await request('/users/me', { user, status: 419 })
		await request('/auth/refresh', { user, status: 403 })
	}
})

test('missing resources and missing query parameters return client errors', async () => {
	await request('/profile', { status: 400 })
	await request('/profile?link=nonexistent-integration-user', { status: 404 })
	await request('/posts', { status: 404 })
	await request('/posts/get-by-id', { status: 400 })
	await request('/auth/login', { method: 'POST', body: { email: 'nonexistent@example.com', password: 'password123' }, status: 400 })
})

test('malformed exclusion input is safely parameterized', async () => {
	await request(`/global/random?exclude=${encodeURIComponent("' OR 1=1 --")}`)
	const [{ count }] = await db.query('SELECT count(*) FROM users')
	assert.ok(Number(count) >= 2)
})
