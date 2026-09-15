FROM node:24-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY src ./src
COPY scripts ./scripts
COPY server ./server
RUN npm run build && mkdir -p /app/var/rooms && chown -R node:node /app/var
ENV NODE_ENV=production PORT=3000 STATE_DIR=/app/var/rooms
USER node
EXPOSE 3000
CMD ["node","server/index.cjs"]
