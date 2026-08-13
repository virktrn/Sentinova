# 📰 Sentinova

> AI-Powered News Aggregation Platform built using Node.js, Express.js, MySQL, Sequelize, Redis, EJS, and JWT Authentication.

Sentinova is a full-stack news platform that aggregates news from external APIs, stores articles in a relational database, provides category-based browsing, search functionality, trending articles, and a role-based content management dashboard.

---

## 🚀 Features

### 👥 Authentication & Authorization

- User Registration
- User Login
- JWT Authentication
- Cookie-based Sessions
- Role-Based Access Control
    - Reader
    - Editor
    - Admin

---

### 📰 News Management

- Automatic News Fetching from GNews API
- Article Storage in MySQL
- Category-Based Filtering
- Search Articles
- Related Articles Suggestions
- Trending News Sidebar
- External Source Linking

---

### ⚡ Performance Optimization

- Redis Caching
- Optimized Database Queries
- Reduced API Calls
- Faster Page Rendering

---

### 🛠 Admin Dashboard

- Create Articles
- Edit Articles
- Delete Articles
- Publish/Unpublish Articles
- Manage Content Centrally

---

### 🎨 Modern User Interface

- Responsive Design
- Mobile Friendly Layout
- Trending Sidebar
- Modern Dashboard
- Professional Authentication Pages
- SEO Optimized Pages

---

## 🏗 System Architecture

```text
                +------------------+
                |   GNews API      |
                +---------+--------+
                          |
                          v
                 Fetch News Script
                          |
                          v
+---------+      +-----------------+      +---------+
|  Redis  | <--> | Express Server  | <--> | MySQL   |
+---------+      +-----------------+      +---------+
                          |
                          v
                    EJS Frontend
```

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MySQL
- Sequelize ORM

### Caching

- Redis

### Authentication

- JWT
- Cookies
- Express Session

### Frontend

- EJS
- HTML5
- CSS3
- JavaScript

### APIs

- GNews API

---

## 📂 Project Structure

```text
Sentinova/
│
├── config/
│   ├── db.js
│   └── redisClient.js
│
├── controllers/
│   ├── articleController.js
│   └── authController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── Article.js
│   └── User.js
│
├── routes/
│   ├── articleRoutes.js
│   └── authRoutes.js
│
├── scripts/
│   └── fetchNews.js
│
├── views/
│   ├── admin/
│   ├── layouts/
│   ├── partials/
│   ├── article.ejs
│   ├── index.ejs
│   ├── login.ejs
│   └── register.ejs
│
├── public/
│   ├── css/
│   ├── images/
│   └── js/
│
├── .env.example
├── package.json
├── server.js
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Sentinova.git

cd Sentinova
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create:

```bash
.env
```

Copy values from:

```bash
.env.example
```

Example:

```env
PORT=5000

DB_NAME=sentinova
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost

SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

GNEWS_API_KEY=your_gnews_api_key
```

---

## 🗄 Database Setup

Create MySQL database:

```sql
CREATE DATABASE sentinova;
```

Start MySQL server.

---

## 🔴 Redis Setup

Mac:

```bash
brew services start redis
```

Check:

```bash
redis-cli ping
```

Expected:

```text
PONG
```

---

## ▶️ Run Application

Start server:

```bash
node server.js
```

or

```bash
npm start
```

Open:

```text
http://localhost:5000
```

---

## 📰 Fetch News Articles

Run:

```bash
node scripts/fetchNews.js
```

This will:

- Connect to GNews API
- Fetch latest articles
- Save them into MySQL
- Skip duplicate articles

---

## 🔐 User Roles

### Reader

- Read Articles
- Search Articles
- Browse Categories

### Editor

- Create Articles
- Edit Articles

### Admin

- Full Dashboard Access
- Manage Content

---

## 📈 Future Improvements

- Dark Mode
- AI Article Summarization
- Bookmark System
- Reading History
- Newsletter Subscription
- Analytics Dashboard
- Infinite Scroll
- Real-Time Notifications

---

## 📸 Screenshots

### Homepage

(Add screenshot)

### Article Page

(Add screenshot)

### Dashboard

(Add screenshot)

### Login Page

(Add screenshot)

---

## 🎯 Learning Outcomes

This project demonstrates:

- Backend Development
- Authentication & Authorization
- RESTful Routing
- Database Design
- ORM Usage
- Redis Caching
- API Integration
- MVC Architecture
- Responsive UI Design
- Full Stack Development

---

## 👨‍💻 Author

**Tarandeep Singh**

Computer Science Student

GitHub:
https://github.com/virktrn


