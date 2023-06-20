FROM node:alpine

RUN mkdir -p /usr/src/cat-archive
WORKDIR /usr/src/cat-archive

COPY . /usr/src/cat-archive
RUN yarn
RUN yarn run build 

ENV HOST=0.0.0.0
ENV PORT=80

ENV PASSWORD_HASH=${{ secrets.PASSWORD_HASH }}
ENV CAPTCHA_KEY=${{ secrets.CAPTCHA_KEY }}
ENV CAPTCHA_SECRET=${{ secrets.CAPTCHA_SECRET }}
ENV DATABASE_URL=${{ secrets.DATABASE_URL }}

CMD ["node", "./dist/server/entry.mjs"]