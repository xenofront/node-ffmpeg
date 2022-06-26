FROM jrottenberg/ffmpeg:3.3-alpine
FROM node:16-alpine as base

# copy ffmpeg bins from first image
COPY --from=0 / /

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY package*.json ./

RUN if [[ $NODE_ENV = "production" ]] ; then \
npm install --omit=dev ; \
else npm install ; \
fi

WORKDIR /var/www

COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm run build
