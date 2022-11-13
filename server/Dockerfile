# BUILDER
FROM node:16-alpine AS BUILDER

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --no-optional --no-audit --progress=false

COPY . .
RUN npm run build

# RUNNER
FROM node:16-alpine as RUNNER

WORKDIR /app

ENV NODE_ENV=production

COPY --from=BUILDER /app/dist ./dist
COPY --from=BUILDER /app/node_modules ./node_modules
COPY --from=BUILDER /app/package.json /app/.env* ./

RUN addgroup -g 1001 -S nodejs
RUN adduser -S runner -u 1001
USER runner

EXPOSE 8080

CMD ["npm", "start"]