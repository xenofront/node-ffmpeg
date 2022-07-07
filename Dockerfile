FROM jrottenberg/ffmpeg:3.3-alpine
FROM node:16-alpine

# copy ffmpeg bins from first image
COPY --from=0 / /

WORKDIR /var/www

COPY . .

RUN npm i

ENV NODE_PATH=./build

RUN npm run build

EXPOSE 3355