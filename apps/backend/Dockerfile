ARG ENV=production

FROM node:20-alpine3.20 AS base

RUN apk update && apk add --no-cache \
  ca-certificates \
  gcompat \
  python3

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV TZ=Europe/Sofia

RUN corepack enable

FROM base AS pruner
WORKDIR /app

COPY . .

RUN npm i -g turbo@2
RUN turbo prune @sapira/backend --docker

FROM base AS builder
ARG ENV
WORKDIR /app

COPY --from=pruner /app/out/json/ ./
COPY --from=pruner /app/out/pnpm-lock.yaml ./
COPY --from=pruner /app/out/pnpm-workspace.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod=false --frozen-lockfile

COPY --from=pruner /app/out/full ./

RUN if [ "$ENV" = "production" ]; then \
  pnpm build; \
  for app in apps/*; do \
  if [ -d "$app" ]; then \
  cd "$app" && \
  find . -mindepth 1 -maxdepth 1 \
  -not \( \
  -name 'dist' \
  -o -name 'node_modules' \
  -o -name 'docker-entrypoint.sh' \
  -o -name 'package.json' \
  \) \
  -exec rm -rf '{}' \; && \
  cd -; \
  fi; \
  done; \
  fi

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  if [ "$ENV" = "production" ]; then \
  pnpm prune --prod; \
  fi

FROM base AS production-runner
ENV NODE_ENV=production
ENV TMPDIR=/dev/shm
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

COPY --from=builder --chown=nodejs:nodejs /app .
RUN chmod +x ./apps/backend/docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["./apps/backend/docker-entrypoint.sh"]