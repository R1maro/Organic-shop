FROM dunglas/frankenphp:1.1-php8.3

WORKDIR /app

RUN apt-get update && apt-get install -y git unzip libpq-dev && rm -rf /var/lib/apt/lists/*
RUN install-php-extensions pdo_pgsql mbstring bcmath zip intl exif gd opcache

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_MEMORY_LIMIT=-1
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction --no-scripts

COPY . .

EXPOSE 8080
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]

