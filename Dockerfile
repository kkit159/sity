# base image
FROM registry.yandex.net/infradev/node:18.12.1-alpine as builder

ARG environ=stable
ARG YENV
ARG S3_ACCESS_KEY_ID
ARG S3_ACCESS_SECRET_KEY

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . ./
RUN npm run build
RUN npm run eslint
RUN npm run stylelint
RUN if [ "$YENV" = "production" ]; then npm run deploy:static; fi

RUN APP_VERSION=$(grep -o '"version": *"[0-9.]*"' package.json | grep -o '[0-9.]*') \
    && sed -i "s/APP_VERSION/$APP_VERSION/g" nginx.conf

# production environment
FROM registry.yandex.net/infradev/nginx:stable-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/nginx /nginx

RUN chmod +x /nginx/nginx.sh

EXPOSE 80
ENTRYPOINT ["/nginx/nginx.sh"]
