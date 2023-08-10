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

FROM nginx:latest

WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist ./
EXPOSE 80

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]