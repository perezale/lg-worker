FROM node:12.18.1-alpine as builder
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm run build


FROM node:12.18.1-alpine
ENV NODE_ENV=production


WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY --from=builder /app/dist ./dist

CMD [ "node", "dist/index.js" ]