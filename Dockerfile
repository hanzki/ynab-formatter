FROM node:8-alpine as builder

COPY . /build

WORKDIR /build

RUN npm install \
    && npm run build \
    && rm -rf node_modules


FROM nginx:alpine

COPY --from=builder /build/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

COPY --from=builder /build/dist/ .

