FROM oven/bun:1 AS builder

WORKDIR /app

COPY --parents --exclude=node_modules **/package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache bun install --frozen-lockfile --dev

COPY packages ./packages
RUN bun run --filter "*" build


FROM base AS server

WORKDIR /app

RUN apt update && apt install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/packages/server/package.json ./
COPY --from=builder /app/packages/server/dist ./dist
RUN --mount=type=cache,target=/root/.bun/install/cache bun install --production

USER bun
CMD ["bun", "start"]


FROM nginx:stable-alpine3.23-perl AS client

COPY --from=builder /app/packages/client/dist /usr/share/nginx/html
COPY packages/client/config/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]