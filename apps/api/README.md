To install dependencies from the monorepo root:
```sh
pnpm install
```

If you need a local database, redis, or S3 server, ensure you start the root docker services first:
```sh
pnpm docker:up
```

To run the API development server from the monorepo root:
```sh
pnpm --filter @repo/api dev
```

open http://localhost:3000
