FROM jrottenberg/ffmpeg:3.3-alpine
FROM node:16-alpine as base

# copy ffmpeg bins from first image
COPY --from=0 / /

COPY package*.json ./

RUN npm install

WORKDIR /var/www

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm run build