# Video Hosting Client

Nuxt 4/Vue client using Pinia 4 and Tailwind CSS 4. Requires Node.js 24.15+
(or Node.js 26+), npm, and the API server.

## Setup and development

Run commands from `client/`:

```sh
npm ci
```

Copy `.env.example` to `.env`. Defaults are `APP_URL=http://localhost:3000` and
`API_URL=http://localhost:7000/api`. Start the API separately, then run:

```sh
npm run dev
```

The development client listens on `http://localhost:3000`. API requests use
credentials; the API CORS origin must match the client origin.

## Production

```sh
npm run build
npm start
```

`npm start` runs `.output/server/index.mjs`. Set `HOST` and `PORT` to change its
listener. `npm run preview` is also available for local preview. Runtime overrides
use Nuxt's `NUXT_PUBLIC_API_URL` and `NUXT_PUBLIC_APP_URL` environment variables.
Deploy the complete `.output/` directory.

Nuxt prevents development and production builds from sharing an active build
directory. Stop the dev server before building, or set `NUXT_BUILD_DIR` to an
isolated directory such as `.nuxt/build-check` for the build process.

## Validation and upgrade notes

```sh
npm run lint
npm run lint:fix
```

The application retains its root-level `pages/`, `components/`, and `stores/`
layout through `srcDir: '.'`. Tailwind 4 uses its Vite plugin; the existing color
configuration is loaded explicitly from `tailwind.config.js`. Templates use the
current opacity, radius, and outline utilities to preserve their appearance.

`@nuxt/icon` replaces `nuxt-icon`, and `pinia-plugin-persistedstate/nuxt` replaces
the separate legacy Nuxt module. Persistence retains the default cookie storage.
ESLint uses the flat `eslint.config.mjs` configuration. TypeScript stays on 6.0.3
because the current ESLint parser supports TypeScript versions below 6.1.

Startup checks cover development and production pages and assets, plus browser
rendering and login/registration overlays. API-backed flows require the API
server on the configured URL. There is no automated client test suite.
