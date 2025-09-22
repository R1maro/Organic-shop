FROM dunglas/frankenphp:1.1-php8.3

WORKDIR /app

RUN apt-get update && apt-get install -y git unzip libpq-dev && rm -rf /var/lib/apt/lists/*
RUN install-php-extensions pdo_pgsql gd intl exif opcache

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --optimize-autoloader

COPY . .

RUN php artisan storage:link || true
RUN php artisan config:cache && php artisan route:cache && php artisan view:cache

ENV APP_ENV=production \
    APP_DEBUG=false \
    SERVER_NAME=":8080"

EXPOSE 8080

CMD ["frankenphp", "php-server", "--document-root=public"]
