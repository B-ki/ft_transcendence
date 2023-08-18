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
RUN pnpm build
RUN pnpm prune --prod

FROM base AS deploy

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

CMD [ "node", "dist/app.js" ]