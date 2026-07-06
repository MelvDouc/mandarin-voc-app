FROM node:24-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
ENV CI=true
RUN corepack enable

WORKDIR /app

COPY --parents --exclude=node_modules **/package.json pnpm-*.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install -r --prod --frozen-lockfile

COPY packages ./packages
RUN pnpm -r build
RUN pnpm --filter=server deploy --prod ./prod/server
RUN pnpm --filter=client deploy --prod ./prod/client


FROM base AS server

WORKDIR /app

RUN apt update && apt install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/prod/server/package.json ./
COPY --from=builder /app/prod/dist ./dist
COPY --from=builder /app/prod/node_modules ./node_modules

USER node
CMD ["node", "dist"]


FROM nginx:stable-alpine3.23-perl AS client

COPY --from=builder /app/prod/client/dist /usr/share/nginx/html
COPY conf/nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]