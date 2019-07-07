FROM php:7.3-fpm-alpine

# Install PHP Extensions
RUN docker-php-ext-install pdo pdo_mysql

# Use the default production configuration
RUN mv "$PHP_INI_DIR/php.ini-development" "$PHP_INI_DIR/php.ini"

