# 🏥 Hospital Management System

A modern web-based solution for managing hospital operations efficiently. Built with **Laravel** (PHP) for the backend and **React + ShadCN UI** for the frontend, it supports features like ward management, dark mode, and responsive design.

---

[![App Platorm](https://github.com/BilalSwl6/react-hospital/blob/main/docs/banner.png)](https://github.com/BilalSwl6/react-hospital/blob/main/docs/banner.png)

## 📦 Installation Guide

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/BilalSwl6/react-hospital.git
cd react-hospital
```

### 2. Backend Setup (Laravel)

```bash
composer install
# or
composer update

cp .env.example .env
php artisan key:generate
```

Configure your `.env` file with correct values for:

* Database
* Mail
* Redis (if used)

### 3. Frontend Setup (React)

```bash
npm install
```

### 4. Database Migrations & Seeding

```bash
php artisan migrate       # For normal setup
php artisan migrate:fresh # For a clean start
php artisan db:seed       # (Optional) To seed demo data
```

### 5. Start the Development Server

```bash
# Option 1: Combined
composer run dev

# Option 2: Separate
php artisan serve
npm run dev
```

---

## 🌐 Live Preview / Screenshots

![App Screenshot](https://github.com/BilalSwl6/react-hospital/blob/main/docs/screenshot.png)

---

## ✨ Key Features

* 🌗 Light/Dark mode toggle
* 📱 Mobile-first responsive design
* 🧩 Built using ShadCN UI components
* 🏥 Ward-based medicine management
* 🔐 Scalable and secure architecture

---

## 🛠 Optimization Plans

* [✅] User Authentication
* [ ] Role & Permission Management
* [ ] API Support for Mobile & Third-party Integration
* [ ] Dockerization
* [ ] Unit & Feature Testing

---

## 📖 Documentation

Check out the full docs at:
👉 **[https://bilalswl6.github.io/react-hospital](https://bilalswl6.github.io/react-hospital)**

---

## 👤 Author

Built with ❤️ by [**@BilalSwl6**](https://github.com/BilalSwl6)

---

> 📝 This project is actively maintained and open to contributions. Feel free to fork or suggest improvements!
