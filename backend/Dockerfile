FROM php:8.2-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application code (including artisan) and install PHP dependencies
COPY . .
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Ensure storage and cache directories are writable
RUN chown -R www-data:www-data storage bootstrap/cache

USER www-data

CMD ["php-fpm"]

