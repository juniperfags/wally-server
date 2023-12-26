FROM node:16-alpine AS builder

USER node
WORKDIR /app

COPY package.json ./
RUN npm i

COPY --chown=node:node . .
RUN npm run build \
  && npm prune --production

# ---

FROM node:16-alpine

ENV NODE_ENV production

USER node
WORKDIR /app

COPY --from=builder --chown=node:node /app/package.json ./
COPY --from=builder --chown=node:node /app/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /app/dist/ ./dist/

CMD ["node", "dist/main.js"]