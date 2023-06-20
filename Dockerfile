FROM node:alpine

RUN mkdir -p /usr/src/cat-archive
WORKDIR /usr/src/cat-archive

COPY . /usr/src/cat-archive
RUN yarn

CMD ["yarn", "run", "start"]