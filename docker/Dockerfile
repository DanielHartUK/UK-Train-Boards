FROM php:7.3-fpm-alpine

# Install PHP Extensions
RUN apk add --no-cache libxml2-dev php-soap \
    && docker-php-ext-configure soap --enable-soap \
    && docker-php-ext-install soap

RUN apk add --no-cache \
    $PHPIZE_DEPS

RUN chown -R www-data:www-data /var/www

ARG WITH_XDEBUG=false

RUN if [ $WITH_XDEBUG = "true" ] ; then \
    pecl install xdebug; \
    docker-php-ext-enable xdebug; \
    echo "error_reporting = E_ALL" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
    echo "display_startup_errors = On" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
    echo "display_errors = On" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
    echo "xdebug.remote_enable=1" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini; \
fi ;


