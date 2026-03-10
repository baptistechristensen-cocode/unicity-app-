FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git curl zip unzip libpq-dev libzip-dev libgd-dev nodejs npm \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath \
    && docker-php-ext-configure gd \
    && docker-php-ext-install gd \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev --optimize-autoloader --no-interaction
RUN npm ci && npm run build

RUN chown -R www-data:www-data storage bootstrap/cache \
    && php artisan storage:link --force

EXPOSE 8080

CMD php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    php artisan migrate --force && \
    php artisan serve --host=0.0.0.0 --port=8080
