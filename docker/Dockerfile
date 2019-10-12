FROM php:7.3-fpm-alpine

RUN apk add --no-cache --virtual .persistent-deps libxml2-dev \
    && docker-php-ext-configure soap --enable-soap \
    && docker-php-ext-install soap