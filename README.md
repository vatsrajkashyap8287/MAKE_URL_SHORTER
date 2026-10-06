# 🔗 ShortX: High-Performance URL Shortener

> A full-stack URL shortening service built with **Node.js, Express, MongoDB and Redis**. It generates collision-safe Base62 short codes, serves redirects through a Redis cache-aside layer, tracks click analytics, and ships with a clean Tailwind CSS interface.

[![Live Demo](https://img.shields.io/badge/Live-Demo_on_Render-brightgreen?style=for-the-badge&logo=render)](https://make-url-shorter.onrender.com)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/vatsrajkashyap8287/MAKE_URL_SHORTER)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![Redis](https://img.shields.io/badge/Redis-Cache-red?style=for-the-badge&logo=redis)](https://redis.io/)

---

## 📌 Table of Contents

- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [How It Works](#-how-it-works)
- [Performance Benchmarks](#-performance-benchmarks)
- [Getting Started](#-getting-started)
- [Author](#-author)

---

## 🌐 Live Demo

| | Link |
|---|---|
| 🚀 **Live Application** | [make-url-shorter.onrender.com](https://make-url-shorter.onrender.com) |
| 💻 **GitHub Repository** | [vatsrajkashyap8287/MAKE_URL_SHORTER](https://github.com/vatsrajkashyap8287/MAKE_URL_SHORTER) |

> ⏳ The app is hosted on Render's free tier, so the first request after a period of inactivity may take a few seconds to wake the server.

---

## ✨ Key Features

- 🔗 **Base62 Short Codes:** Compact, URL-safe 7-character codes, giving 62⁷ ≈ **3.5 trillion** possible combinations.
- ⚡ **Redis Cache-Aside:** Hot links are served from Redis, so repeat redirects skip the database lookup.
- 📊 **Click Analytics:** Tracks click count, creation timestamp and destination URL for every short code, updated with atomic MongoDB operations.
- 🔒 **Collision Safety:** A unique index on `shortCode` combined with an application-level retry loop guarantees no duplicate codes.
- 🛡️ **Graceful Degradation:** If Redis goes down, the app automatically falls back to direct MongoDB queries instead of failing.
- 🎨 **Modern UI:** Responsive, dark-themed single-page interface built with Tailwind CSS and FontAwesome.
- 🧪 **Load-Tested:** Benchmarked with Autocannon at 50 concurrent connections with zero errors.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | HTML5, Tailwind CSS, JavaScript (ES6+) | Responsive single-page UI served via Express static middleware |
| **Backend** | Node.js, Express.js | Non-blocking REST API server |
| **Database** | MongoDB Atlas | Persistent storage with a unique B-tree index on `shortCode` |
| **Cache** | Redis / Upstash | In-memory key-value store with TTL for fast lookups |
| **ID Generation** | NanoID (custom Base62 alphabet) | Cryptographically strong 7-character codes |
| **Benchmarking** | Autocannon | HTTP load testing and concurrency benchmarks |
| **Deployment** | Render | Cloud web service hosting |

---

## 🏗️ System Architecture

```text
            ┌──────────────────────────────────┐
            │  Client Browser / API Consumer   │
            └────────────────┬─────────────────┘
                             │
                        HTTP Request
                             │
                             ▼
            ┌──────────────────────────────────┐
            │      Express.js Web Server       │
            │   (Routes, Validation, Static)   │
            └───────┬──────────────────┬───────┘
                    │                  │
             Cache Read/Write     Database Query
                    │                  │
                    ▼                  ▼
            ┌───────────────┐   ┌───────────────┐
            │  Redis Cache  │   │ MongoDB Atlas │
            │  (Hot Links)  │   │ (Persistent)  │
            └───────────────┘   └───────────────┘
```

---

## ⚙️ How It Works

**Creating a short link**
1. The client submits a long URL, and the server validates it.
2. A 7-character Base62 code is generated with NanoID.
3. The code is saved in MongoDB. If the unique index rejects a duplicate, a new code is generated and the save is retried.
4. The short URL is returned to the client.

**Redirecting a short link**
1. The server checks Redis for the short code (**cache hit** → redirect immediately).
2. On a **cache miss**, it queries MongoDB, stores the result in Redis with a TTL, then redirects.
3. The click counter is incremented atomically in MongoDB.
4. If Redis is unavailable, the server skips the cache and serves directly from MongoDB.

---

## 📊 Performance Benchmarks

Tested with **Autocannon** using **50 concurrent connections** over **10-second** runs.

| Endpoint | Throughput | Avg Latency | p99 Latency | Result |
|---|---|---|---|---|
| `GET /health` | ~10,285 req/sec | 4.4 ms | 10 ms | 103k requests, 0 errors |
| `GET /:shortCode` (302 redirect) | ~1,974 req/sec | 24.8 ms | 82 ms | 20k redirects, 0 errors |

> **Takeaway:** The service sustains roughly **2,000 successful redirects per second** with zero errors, while atomically updating click analytics on MongoDB for every request.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18 or higher
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- A Redis instance (local or [Upstash](https://upstash.com/))

### 1. Clone and install

```bash
git clone https://github.com/vatsrajkashyap8287/MAKE_URL_SHORTER.git
cd MAKE_URL_SHORTER
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/url-shortener
REDIS_HOST=localhost
REDIS_PORT=6379
BASE_URL=http://localhost:5000
```

### 3. Run the application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## 👨‍💻 Author

**Vats Raj Kashyap**

- GitHub: [@vatsrajkashyap8287](https://github.com/vatsrajkashyap8287)
- Live Deployment: [make-url-shorter.onrender.com](https://make-url-shorter.onrender.com)

---

⭐ If you found this project useful, consider giving it a star!
