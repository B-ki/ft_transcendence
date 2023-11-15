FROM node:18 AS base

RUN npm i -g pnpm
ENV PNPM_HOME=/pnpm
WORKDIR /app

FROM base AS dependencies

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --silent

FROM base AS build

COPY ./ ./
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm prisma generate
RUN pnpm build
RUN pnpm prune --prod

FROM node:18-slim

RUN apt-get update && apt-get install libssl-dev dumb-init -y --no-install-recommends

WORKDIR /app
COPY --chown=node:node --from=build /app/dist ./dist

COPY --chown=node:node --from=build /app/node_modules ./node_modules

COPY --chown=node:node --from=build /app/prisma ./prisma

COPY ./docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENV NODE_ENV production
EXPOSE 8081

CMD [ "dumb-init", "node", "dist/src/main.js" ]