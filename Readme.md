# Lebaba Shopping Mall — Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-9.x-880000?style=for-the-badge)
![Stripe](https://img.shields.io/badge/Stripe-16.x-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

**Production-ready RESTful API for a full-stack e-commerce shopping mall**

[API Documentation](#api-documentation) · [Quick Start](#quick-start) · [Endpoints](#api-endpoints-overview) · [Deployment](#deployment)

</div>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Endpoints Overview](#api-endpoints-overview)
- [Authentication](#authentication)
- [API Documentation](#api-documentation)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Project Overview

The **Lebaba Shopping Mall API** is a scalable, production-ready RESTful backend powering a multi-category e-commerce platform. It handles the complete shopping lifecycle — user registration and authentication, product catalog management, Stripe-powered checkout, order fulfilment tracking, customer reviews, and admin analytics.

### Core Capabilities

| Domain | What it does |
|--------|-------------|
| **Auth** | JWT-based auth via HTTP-only cookies, bcrypt password hashing, role-based access (user / admin) |
| **Products** | Full CRUD with pagination, multi-field filtering (category, color, price range) |
| **Orders** | Stripe Checkout session creation, payment confirmation webhook, order lifecycle management |
| **Reviews** | One-per-user product reviews with automatic average rating recalculation |
| **Stats** | Real-time user and admin analytics with monthly earnings aggregation |
| **Contact** | Contact form storage with admin read/reply tracking |
| **Images** | Base64 → Cloudinary CDN upload pipeline |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Client (React)                    │
│          http://localhost:5173  /  Vercel CDN        │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS + Cookie (JWT)
┌──────────────────────▼──────────────────────────────┐
│               Express API Server                     │
│                 Port 5000                            │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Auth   │  │ Products │  │  Orders + Stripe │  │
│  │ Middleware│  │   CRUD   │  │    Checkout      │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ Reviews  │  │  Stats   │  │  Contact + Upload │  │
│  │  + Rating│  │ Analytics│  │    Cloudinary     │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │           Swagger UI  /api-docs              │   │
│  └─────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │ Mongoose ODM
┌──────────────────────▼──────────────────────────────┐
│              MongoDB Atlas (Cloud)                   │
│   Users | Products | Orders | Reviews | Contacts    │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Runtime | Node.js | 18+ |
| Framework | Express.js | 4.21 |
| Database | MongoDB Atlas | 7.x |
| ODM | Mongoose | 9.6 |
| Auth | JSON Web Tokens (jsonwebtoken) | 9.0 |
| Password Hashing | bcrypt | 5.1 |
| Payments | Stripe SDK | 16.x |
| Image Hosting | Cloudinary SDK | 2.5 |
| API Docs | Swagger UI Express + swagger-jsdoc | 5.0 / 6.3 |
| Cookie Parsing | cookie-parser | 1.4 |
| CORS | cors | 2.8 |
| Dev Server | nodemon | 3.1 |

---

## Prerequisites

Before running this project, make sure you have:

- **Node.js** ≥ 18.0 — [Download](https://nodejs.org/)
- **npm** ≥ 9 or **yarn** ≥ 1.22
- A **MongoDB Atlas** account — [Sign up free](https://www.mongodb.com/cloud/atlas)
- A **Stripe** account — [Sign up free](https://stripe.com)
- A **Cloudinary** account — [Sign up free](https://cloudinary.com)

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-username/shopping-mall.git
cd shopping-mall/backend
```

### 2. Install dependencies

```bash
# Using yarn (recommended)
yarn install

# Or using npm
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in your values — see [Environment Variables](#environment-variables) below.

### 4. Start the development server

```bash
# Development (with auto-reload)
yarn dev

# Production
yarn start
```

The API will be available at:
- **REST API:** `http://localhost:5000`
- **Swagger Docs:** `http://localhost:5000/api-docs`
- **OpenAPI JSON:** `http://localhost:5000/api-docs.json`

---

## Environment Variables

Create a `.env` file in the `/backend` root with the following variables:

```env
# ─── Database ──────────────────────────────────────────────
# MongoDB Atlas connection string
# Get from: Atlas Dashboard > Connect > Drivers
UB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority

# ─── Authentication ────────────────────────────────────────
# Strong random secret for JWT signing (min 32 characters)
# Generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET_KEY=your_super_secret_jwt_key_minimum_32_chars

# ─── Stripe Payments ───────────────────────────────────────
# Get from: Stripe Dashboard > Developers > API Keys
STRIPE_SECRET_KEY=sk_test_51PaxS2...

# ─── Cloudinary Image Upload ───────────────────────────────
# Get from: Cloudinary Dashboard > Settings > API Keys
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── Server ────────────────────────────────────────────────
PORT=5000
```

> ⚠️ **Never commit `.env` to version control.** The `.gitignore` already excludes it.

---

## Project Structure

```
backend/
├── index.js                    # Express app entry point, middleware, route registration
├── package.json
├── .env                        # Environment variables (not committed)
├── .gitignore
│
├── src/
│   ├── config/
│   │   └── swagger.js          # OpenAPI 3.0 spec definition & schemas
│   │
│   ├── docs/                   # JSDoc route documentation (Swagger annotations)
│   │   ├── auth.docs.js
│   │   ├── products.docs.js
│   │   ├── orders.docs.js
│   │   ├── reviews.docs.js
│   │   ├── stats.docs.js
│   │   ├── contact.docs.js
│   │   └── upload.docs.js
│   │
│   ├── middleware/
│   │   ├── generateToken.js    # JWT creation
│   │   ├── verifyToken.js      # JWT verification middleware
│   │   └── verifyAdmin.js      # Admin role guard middleware
│   │
│   ├── users/
│   │   ├── user.model.js       # Mongoose schema: User
│   │   ├── user.controller.js  # register, login, logout, CRUD
│   │   └── user.route.js       # /api/auth/*
│   │
│   ├── products/
│   │   ├── product.model.js    # Mongoose schema: Product
│   │   ├── product.controller.js
│   │   └── product.route.js    # /api/products/*
│   │
│   ├── orders/
│   │   ├── order.model.js      # Mongoose schema: Order
│   │   ├── order.controller.js # Stripe checkout + order management
│   │   └── order.route.js      # /api/orders/*
│   │
│   ├── reviews/
│   │   ├── review.model.js     # Mongoose schema: Review
│   │   ├── review.controller.js
│   │   └── review.route.js     # /api/reviews/*
│   │
│   ├── stats/
│   │   └── stats.route.js      # /api/stats/* (inline handlers)
│   │
│   ├── contact/
│   │   ├── contact.model.js    # Mongoose schema: Contact
│   │   ├── contact.controller.js
│   │   └── contact.route.js    # /api/contact/*
│   │
│   └── utilis/
│       ├── baseURL.js          # Frontend base URL for Stripe redirects
│       ├── responseHandler.js  # Unified success/error response helpers
│       └── UploadImage.js      # Cloudinary upload utility
```

---

## API Endpoints Overview

All endpoints return a consistent JSON envelope:

```json
{
  "success": true,
  "message": "Human-readable description",
  "data": { ... }
}
```

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ Public | Register new user |
| `POST` | `/login` | ❌ Public | Login, sets JWT cookie |
| `POST` | `/logout` | ❌ Public | Clears JWT cookie |
| `GET` | `/users` | 🔐 Admin | List all users |
| `DELETE` | `/users/:id` | 🔐 Admin | Delete a user |
| `PUT` | `/users/:id` | 🔐 Admin | Update user role |
| `PATCH` | `/edit-profile/:id` | 🔑 User | Edit own profile |

### Products — `/api/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ❌ Public | List products (filter + paginate) |
| `GET` | `/:id` | ❌ Public | Get product + reviews |
| `POST` | `/create-product` | 🔐 Admin | Create product |
| `PATCH` | `/update-product/:id` | 🔐 Admin | Update product |
| `DELETE` | `/:id` | 🔐 Admin | Delete product + reviews |

### Orders — `/api/orders`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/create-checkout-session` | ❌ Public | Create Stripe session |
| `POST` | `/confirm-payment` | ❌ Public | Confirm payment, save order |
| `GET` | `/` | ❌ Public | Get all orders (admin use) |
| `GET` | `/:email` | ❌ Public | Get orders by email |
| `GET` | `/order/:id` | ❌ Public | Get single order by ID |
| `PATCH` | `/update-order-status/:id` | ❌ Public | Update order status |
| `DELETE` | `/delete-order/:id` | ❌ Public | Delete an order |

### Reviews — `/api/reviews`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/post-review` | 🔑 User | Post or update review |
| `GET` | `/total-reviews` | ❌ Public | Total review count |
| `GET` | `/:userId` | ❌ Public | Reviews by user |

### Stats — `/api/stats`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/user-stats/:email` | ❌ Public | User dashboard stats |
| `GET` | `/admin-stats` | ❌ Public | Admin dashboard analytics |

### Contact — `/api/contact`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ❌ Public | Submit contact form |
| `GET` | `/` | 🔐 Admin | Get all messages |
| `PATCH` | `/:id` | 🔐 Admin | Update message status |

### Upload

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/uploadImage` | ❌ Public | Upload base64 image to Cloudinary |

---

## Authentication

The API uses **JWT tokens stored in HTTP-only cookies** for stateless authentication.

### How it works

```
1. Client  →  POST /api/auth/login  { email, password }
2. Server  →  Validates credentials, signs JWT: { userId, role }
3. Server  →  Sets cookie: token=<jwt>; HttpOnly; Secure; SameSite=None
4. Client  →  All subsequent requests automatically carry the cookie
5. Server  →  verifyToken middleware decodes JWT, attaches userId + role to req
6. Server  →  verifyAdmin middleware checks req.role === 'admin'
```

### Token details

| Property | Value |
|----------|-------|
| Algorithm | HS256 |
| Payload | `{ userId, role }` |
| Expiry | 1 hour |
| Storage | HTTP-only cookie (not accessible via JS) |
| Cookie flags | `HttpOnly`, `Secure`, `SameSite=None` |

### Testing with Postman

1. Go to **Settings → Cookies** and enable "Automatically follow redirects"
2. Call `POST /api/auth/login` — the cookie is saved automatically
3. Subsequent requests in the same collection will carry the cookie

---

## API Documentation

The full interactive API documentation is available via Swagger UI.

### Access

| URL | Description |
|-----|-------------|
| `http://localhost:5000/api-docs` | Interactive Swagger UI |
| `http://localhost:5000/api-docs.json` | Raw OpenAPI 3.0 JSON spec |

### Features

- **Try it out** — execute real API calls directly from the browser
- **Authentication** — click the "Authorize" button to set cookie auth for protected routes
- **Schema viewer** — explore all request/response models
- **Examples** — every endpoint includes realistic request/response examples
- **Filter** — search endpoints by tag or path

### Screenshot

```
┌─────────────────────────────────────────────────────┐
│  Lebaba Shopping Mall API   v1.0.0                  │
│  ─────────────────────────────────────────────────  │
│  ▶ Auth          (7 endpoints)                      │
│  ▶ Products      (5 endpoints)                      │
│  ▶ Orders        (7 endpoints)                      │
│  ▶ Reviews       (3 endpoints)                      │
│  ▶ Stats         (2 endpoints)                      │
│  ▶ Contact       (3 endpoints)                      │
│  ▶ Upload        (1 endpoint)                       │
└─────────────────────────────────────────────────────┘
```

---

## Data Models

### User

```javascript
{
  username:     String (required, unique),
  email:        String (required, unique),
  password:     String (required, bcrypt hashed),
  profileImage: String (Cloudinary URL),
  bio:          String (max 200 chars),
  profession:   String,
  role:         "user" | "admin"  (default: "user"),
  createdAt:    Date
}
```

### Product

```javascript
{
  name:        String (required),
  category:    "accessories" | "dress" | "jewellery" | "cosmetics",
  description: String,
  price:       Number (required),
  oldPrice:    Number,
  image:       String (required, Cloudinary URL),
  color:       "black" | "red" | "gold" | "blue" | "silver" | "beige" | "green",
  rating:      Number (0–5, auto-calculated from reviews),
  author:      ObjectId → User,
  createdAt:   Date,
  updatedAt:   Date
}
```

### Order

```javascript
{
  orderId:   String (Stripe PaymentIntent ID),
  products:  [{ productId: String, quantity: Number }],
  email:     String (required),
  amount:    Number (USD),
  status:    "pending" | "processing" | "shipped" | "completed",
  createdAt: Date,
  updatedAt: Date
}
```

### Review

```javascript
{
  comment:   String (required),
  rating:    Number (required, 1–5),
  userId:    ObjectId → User (required),
  productId: ObjectId → Product (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Contact

```javascript
{
  name:      String (required, max 100),
  email:     String (required, valid format),
  subject:   String (required, max 200),
  message:   String (required, max 2000),
  status:    "unread" | "read" | "replied"  (default: "unread"),
  createdAt: Date
}
```

---

## Error Handling

All errors return a consistent format:

```json
{
  "success": false,
  "message": "Human-readable error description",
  "error": "Technical error detail (null in production)"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request — missing/invalid fields |
| `401` | Unauthorized — missing or invalid JWT cookie |
| `403` | Forbidden — admin role required |
| `404` | Not Found |
| `500` | Internal Server Error |

---

## Deployment

### Deploy to Vercel

1. Install [Vercel CLI](https://vercel.com/cli): `npm i -g vercel`
2. From the `/backend` directory: `vercel`
3. Follow the prompts
4. Add all environment variables in **Vercel Dashboard → Settings → Environment Variables**

### Deploy to Railway

1. Connect your GitHub repo on [railway.app](https://railway.app)
2. Select the `/backend` directory as root
3. Set `START_COMMAND` to `node index.js`
4. Add all environment variables in the Railway dashboard

### Environment Variables for Production

All variables from `.env` must be set in your hosting platform:

```
UB_URL               MongoDB Atlas connection string
JWT_SECRET_KEY       JWT signing secret
STRIPE_SECRET_KEY    Stripe secret key (use live key for production)
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
PORT                 (optional — platforms set this automatically)
```

---

## Scripts

```bash
yarn dev      # Start development server with nodemon (auto-reload)
yarn start    # Start production server
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the **ISC License**.

---

<div align="center">

Built with ❤️ using Node.js, Express, MongoDB & Stripe

</div>
