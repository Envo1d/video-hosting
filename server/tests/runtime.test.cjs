const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const { once } = require('node:events')
const path = require('node:path')
const fs = require('node:fs/promises')

const env = {
	...process.env, NODE_ENV: 'test', NODE_CONFIG: '{}',
	POSTGRES_HOST: '127.0.0.1', POSTGRES_PORT: '16500', POSTGRES_USER: 'test',
	POSTGRES_PASSWORD: 'test', POSTGRES_DB: 'video_hosting_test',
	REDIS_URL: 'redis://127.0.0.1:16379',
	JWT_ACCESS_TOKEN_KEY: 'integration-test-access-key', JWT_REFRESH_TOKEN_KEY: 'integration-test-refresh-key',
	UPLOAD_DIR: path.resolve('tmp/runtime-test-uploads')
}

test('TypeORM source CLI connects and recognizes applied migrations', async () => {
	const child = spawn(process.execPath, ['node_modules/typeorm/cli-ts-node-commonjs.js', 'migration:show', '-d', 'src/utils/data-source.ts'], {
		env: { ...env, NODE_CONFIG_DIR: path.resolve('config') }, stdio: ['ignore', 'pipe', 'pipe']
	})
	let output = ''
	child.stdout.on('data', data => { output += data })
	child.stderr.on('data', data => { output += data })
	const [code] = await once(child, 'exit')
	assert.equal(code, 0, output)
	assert.match(output, /\[X\].*Structure1706746317842/)
	assert.match(output, /\[X\].*AddReposts1793188800000/)
}, { timeout: 15000 })

for (const runtime of [
	{ name: 'development TypeScript entry point', args: ['-r', 'ts-node/register', 'src/app.ts'], config: 'config', port: '17001' },
	{ name: 'compiled production entry point', args: ['build/src/app.js'], config: 'build/config', port: '17002' }
]) {
	test(runtime.name, async () => {
		const child = spawn(process.execPath, runtime.args, {
			env: { ...env, NODE_CONFIG_DIR: path.resolve(runtime.config), PORT: runtime.port, APP_URL: `http://127.0.0.1:${runtime.port}` },
			stdio: ['ignore', 'pipe', 'pipe']
		})
		let output = ''
		child.stdout.on('data', data => { output += data })
		child.stderr.on('data', data => { output += data })
		try {
			for (let i = 0; i < 100; i++) {
				assert.equal(child.exitCode, null, output)
				try {
					const response = await fetch(`http://127.0.0.1:${runtime.port}/api/healthchecker`, { signal: AbortSignal.timeout(1000) })
					if (response.ok) {
						assert.equal((await response.json()).status, 'success')
						return
					}
				} catch {}
				await new Promise(resolve => setTimeout(resolve, 100))
			}
			assert.fail(output)
		} finally {
			if (child.exitCode === null) {
				const stopped = once(child, 'exit')
				child.kill()
				await stopped
			}
			assert.equal(path.dirname(env.UPLOAD_DIR), path.resolve('tmp'))
			await fs.rm(env.UPLOAD_DIR, { recursive: true, force: true })
		}
	}, { timeout: 20000 })
}
