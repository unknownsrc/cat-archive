FROM node:alpine

RUN mkdir -p /usr/src/cat-archive
WORKDIR /usr/src/cat-archive

ARG PASSWORD_HASH
ARG CAPTCHA_KEY
ARG CAPTCHA_SECRET
ARG DATABASE_URL

COPY . /usr/src/cat-archive
RUN yarn
RUN yarn run build 

ENV HOST=0.0.0.0
ENV PORT=80

ENV PASSWORD_HASH=$PASSWORD_HASH
ENV CAPTCHA_KEY=$CAPTCHA_KEY
ENV CAPTCHA_SECRET=$CAPTCHA_SECRET
ENV DATABASE_URL=$DATABASE_URL

CMD ["node", "./dist/server/entry.mjs"]