🛍️ FreshOil Shop

A free e-commerce project built with Laravel (backend) and Next.js (frontend).
Fast, modern, and API-driven architecture designed for performance and scalability.

## ✨ Features

- 🛒 **Product Management**
  - Add new products
  - Upload multiple images per product
  - Manage pricing and stock

- 🖼️ **Built-in Blog**
  - Publish blog posts with text and images
  - Simple content management system

- 🧾 **Activity & Change Logging**
  - Log all status updates and changes made by users (who/what/when, before/after)

- 💖 **Wishlist**
  - Users can save products to a personal wishlist for quick access later


⚡ API-first Architecture

Fully decoupled backend (Laravel API) and frontend (Next.js)

Optimized for speed and flexibility

🔐 Authentication & Security

User registration and login

Cookie-based secure authentication

📱 Responsive Design

Mobile-friendly and desktop-ready UI
<br/>
<br/>
<br/>

🛠️ Tech Stack
<br/>
<br/>
Backend (Laravel)

PHP 8+

Laravel 10

PostgreSQL / MySQL

Sanctum Authentication

File storage for images

Frontend (Next.js)

React 18

Next.js 14

TailwindCSS

Fetch for API requests
<br/>
<br/>
<br/>

📂 Project Structure
<br/>
<br/>
freshoil/
<br/>
│── backend/   # Laravel backend (API)
<br/>
│── frontend/  # Next.js frontend

🚀 Getting Started
<br/>
<br/>
Backend
<br/>
cd backend
<br/>
cp .env.example .env
<br/>
composer install
<br/>
php artisan key:generate
<br/>
php artisan migrate --seed
<br/>
php artisan serve
<br/>

Frontend
<br/>
cd frontend
<br/>
cp .env.example .env
<br/>
npm install
<br/>
npm run dev
<br/>

⚙️ Environment Variables
<br/>

Laravel (.env)
<br/>

APP_NAME=FreshOil
<br/>
APP_ENV=local
<br/>
APP_KEY=base64:************
<br/>
APP_URL=http://localhost:8000
<br/>

DB_CONNECTION=mysql
<br/>
DB_HOST=127.0.0.1
<br/>
DB_PORT=3306
<br/>
DB_DATABASE=freshoil
<br/>
DB_USERNAME=root
<br/>
DB_PASSWORD=
<br/>


Next.js (.env.local)
<br/>

NEXT_PUBLIC_API_URL=http://localhost:8000/api
<br/>


Also note: there’s a separate config for the API URL in config/Config.ts.
<br/>




📸 Screenshots
Home Page
<img width="1748" height="958" alt="Screenshot (30)" src="https://github.com/user-attachments/assets/6095011a-8696-4d6e-a064-9cdefa4c89c2" /> <img alt="Second Screenshot" src="https://github.com/user-attachments/assets/f0f5277a-267a-405d-bd1c-b372a9be5deb" />
Product Details
<img alt="Product Screenshot" src="https://github.com/user-attachments/assets/cc2480d8-0847-4334-9d96-27bcfb8317ba" />
Blog

🤝 Contributing

This project is open source:

Found a bug? → Open an issue.

Have a feature idea? → Submit a pull request.

📜 License

MIT License © 2025 FreshOil

⭐⭐⭐ If you found it interesting and useful, please give it a star. Thank you. ⭐⭐⭐
