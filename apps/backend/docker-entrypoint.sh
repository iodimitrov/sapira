#!/bin/sh

set -e

pnpm --prefix packages/database migration:run

exec node ./apps/backend/dist/main.js
