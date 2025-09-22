# 🛍️ FreshOil Shop

A **free e-commerce project** built with **Laravel** (backend) and **Next.js** (frontend).  
Fast, modern, and API-driven architecture designed for performance and scalability.

---

## ✨ Features

- 🛒 **Product Management**
  - Add new products  
  - Upload multiple images per product  
  - Manage pricing and stock  

- 🖼️ **Built-in Blog**
  - Publish blog posts with text and images  
  - Simple content management system  

- ⚡ **API-first Architecture**
  - Fully decoupled backend (Laravel API) and frontend (Next.js)  
  - Optimized for speed and flexibility  

- 🔐 **Authentication & Security**
  - User registration and login  
  - JWT-based secure authentication  

- 📱 **Responsive Design**
  - Mobile-friendly and desktop-ready UI  

---

## 🛠️ Tech Stack

### Backend (Laravel)
- PHP 8+  
- Laravel 10  
- PostgreSQL / MySQL  
- JWT Authentication  
- File storage for images  

### Frontend (Next.js)
- React 18  
- Next.js 14  
- TailwindCSS  
- Axios for API requests  

---

## 📂 Project Structure

freshoil/
│── backend/ # Laravel backend (API)
│── frontend/ # Next.js frontend


## 🚀 Getting Started

### Backend
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve

### Fronend
cd frontend
cp .env.example .env
npm install
npm run dev


⚙️ Environment Variables
Laravel
APP_NAME=FreshOil
APP_ENV=local
APP_KEY=base64:************
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=freshoil
DB_USERNAME=root
DB_PASSWORD=

Next.js
NEXT_PUBLIC_API_URL=http://localhost:8000/api
Also you have a config for api url(in config/Config.ts)


📸 Screenshots
Home Page

<img width="1920" height="796" alt="Annotation 2025-09-22 133443" src="https://github.com/user-attachments/assets/8c865400-7baa-4c69-8ed1-2da1a6fa019d" />


<img width="1894" height="903" alt="image" src="https://github.com/user-attachments/assets/f0f5277a-267a-405d-bd1c-b372a9be5deb" />


Product Details

`<img width="1869" height="919" alt="Annotation 2025-09-22 133719" src="https://github.com/user-attachments/assets/cc2480d8-0847-4334-9d96-27bcfb8317ba" />`



## Blog

![Annotation 1](https://github.com/user-attachments/assets/44552736-9220-4b65-b70e-10b6619f58e5)

![Annotation 2](https://github.com/user-attachments/assets/7abf2a8f-f136-44cc-a75c-71cbbe763f00)




🤝 Contributing

This project is open source:

Found a bug? → Open an issue.

Have a feature idea? → Submit a pull request.

📜 License

MIT License © 2025 FreshOil


---

⭐⭐⭐ If you found it interesting and useful, please give it a star. Thank you. ⭐⭐⭐

