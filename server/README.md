# Video Hosting API

Requires Node.js 24 or newer, npm, PostgreSQL and Redis.

## Local development

Copy `.env.example` to `.env`, then run from `server/`:

```sh
npm ci
docker compose up -d
npm run db:push
npm run dev
```

The API defaults to `http://localhost:7000/api`. `APP_URL` is the public server
origin used for uploaded media. `REDIS_URL` defaults to `redis://localhost:6379`.
Uploads default to `src/public/`; set `UPLOAD_DIR` to use another persistent directory.
Development mode synchronizes entities automatically; production uses migrations.

## Build and migrations

```sh
npm run build
npm start
npm run migrate     # Generate a migration after changing entities; review its SQL
npm run db:push     # Apply migrations to the configured database
npm run lint
```

Builds clear generated output first to prevent obsolete migration files from running.
Compiled startup loads compiled configuration and entities. The upgrade includes
`AddReposts1793188800000`, which adds the repost counter used by `PUT /api/posts`.
Use migration commands only against the intended database. Existing databases
created with development synchronization need their migration history baselined
before applying the original table-creation migration.

## Integration tests

```sh
docker compose -p video-hosting-tests -f docker-compose.test.yml up -d --wait
npm test
docker compose -p video-hosting-tests -f docker-compose.test.yml down -v
```

Tests use dedicated PostgreSQL and Redis services on ports 16500 and 16379, plus
API ports 17000–17002. They override database credentials and store temporary
uploads under `tmp/`; development data is never used. The suite exercises every
API route, authentication/session expiry, validation, media upload and deletion,
profiles, feeds, likes, comments, subscriptions, reposts, the migration CLI, and
source/compiled startup. API tests use the sample MP4 in `client/public/water.mp4`.

## Dependency upgrade notes

Runtime packages and other tooling are pinned to current stable npm releases.
TypeScript is pinned to 6.0.3 because the current `@typescript-eslint` packages
support TypeScript versions below 6.1; TypeScript 7 is outside that supported range.
Node's watch mode replaces `ts-node-dev`. ESLint uses a flat configuration and
checks unhandled promises without introducing unrelated formatting changes.
