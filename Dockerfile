FROM node:alpine

RUN mkdir -p /usr/src/cat-archive
WORKDIR /usr/src/cat-archive

COPY . /usr/src/cat-archive
RUN yarn
RUN yarn run build 

ENV HOST=0.0.0.0
ENV PORT=80
CMD ["node", "./dist/server/entry.mjs"]