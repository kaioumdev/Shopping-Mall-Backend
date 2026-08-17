const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ShoppingMall Shopping Mall API',
            version: '1.0.0',
            description: `
## Welcome to the ShoppingMall Shopping Mall REST API

This is the complete API documentation for the **ShoppingMall E-Commerce Shopping Mall** backend.  
Built with **Node.js**, **Express**, **MongoDB (Mongoose)**, and **Stripe** for payments.

---

### 🔐 Authentication
Most write operations and all admin endpoints require a valid **JWT token** stored in an **HTTP-only cookie** named \`token\`.

**How to authenticate:**
1. Call \`POST /api/auth/login\` with your email and password.
2. The server sets a \`token\` cookie automatically.
3. All subsequent requests carry this cookie automatically (browser/Postman with cookie jar enabled).

> Admin-only endpoints additionally require the authenticated user to have \`role: "admin"\`.

---

### 📦 Base URL
- **Local development:** \`http://localhost:5000\`
- **Production:** \`https://shopping-mall-backend.vercel.app\` *(backend domain)*

---

### 🚀 Quick Start Guide

\`\`\`
1. Register a new account:
   POST /api/auth/register  { username, email, password }

2. Login to get your auth cookie:
   POST /api/auth/login  { email, password }

3. Browse products:
   GET /api/products?page=1&limit=10

4. View a single product:
   GET /api/products/:id

5. Checkout (creates Stripe session):
   POST /api/orders/create-checkout-session  { products, userId }

6. Confirm payment after redirect:
   POST /api/orders/confirm-payment  { session_id }

7. View your orders:
   GET /api/orders/:email

8. Post a review (auth required):
   POST /api/reviews/post-review  { comment, rating, userId, productId }
\`\`\`

---

### 📌 Response Format
All endpoints return a consistent JSON envelope:
\`\`\`json
{
  "success": true,
  "message": "Human-readable status message",
  "data": { ... }
}
\`\`\`

Error responses follow the same structure with \`"success": false\`.
            `,
            contact: {
                name: 'ShoppingMall API Support',
                email: 'support@ShoppingMall.com',
            },
            license: {
                name: 'MIT',
            },
        },
        servers: [
            { url: 'https://shopping-mall-backend.vercel.app', description: 'Production Server' },
            { url: 'http://localhost:5000', description: 'Local Development Server' },
        ],
        tags: [
            { name: 'Auth', description: 'User registration, login, logout, and profile management' },
            { name: 'Products', description: 'Browse, create, update, and delete products' },
            { name: 'Orders', description: 'Stripe checkout, payment confirmation, and order management' },
            { name: 'Reviews', description: 'Post and retrieve product reviews' },
            { name: 'Stats', description: 'User and admin analytics dashboards' },
            { name: 'Contact', description: 'Contact form submissions and admin message management' },
            { name: 'Upload', description: 'Image upload to Cloudinary' },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token',
                    description: 'JWT token stored as an HTTP-only cookie. Obtained via `POST /api/auth/login`.',
                },
            },
            schemas: {
                // ── AUTH ──────────────────────────────────────────────
                RegisterRequest: {
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                        username: { type: 'string', example: 'john_doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', format: 'password', minLength: 6, example: 'secret123' },
                    },
                },
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        password: { type: 'string', format: 'password', example: 'secret123' },
                    },
                },
                UserPublic: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
                        username: { type: 'string', example: 'john_doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
                        profileImage: { type: 'string', example: 'https://res.cloudinary.com/...' },
                        bio: { type: 'string', example: 'Fashion lover from London' },
                        profession: { type: 'string', example: 'Designer' },
                    },
                },
                EditProfileRequest: {
                    type: 'object',
                    properties: {
                        username: { type: 'string', example: 'john_updated' },
                        profileImage: { type: 'string', example: 'https://res.cloudinary.com/...' },
                        bio: { type: 'string', maxLength: 200, example: 'Updated bio text' },
                        profession: { type: 'string', example: 'Software Engineer' },
                    },
                },
                UpdateRoleRequest: {
                    type: 'object',
                    required: ['role'],
                    properties: {
                        role: { type: 'string', enum: ['user', 'admin'], example: 'admin' },
                    },
                },
                // ── PRODUCT ───────────────────────────────────────────
                Product: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d2' },
                        name: { type: 'string', example: 'Diamond Earrings' },
                        category: { type: 'string', enum: ['accessories', 'dress', 'jewellery', 'cosmetics'], example: 'jewellery' },
                        description: { type: 'string', example: 'Beautiful handcrafted diamond earrings' },
                        price: { type: 'number', example: 149.99 },
                        oldPrice: { type: 'number', example: 199.99 },
                        image: { type: 'string', example: 'https://res.cloudinary.com/...' },
                        color: { type: 'string', enum: ['black', 'red', 'gold', 'blue', 'silver', 'beige', 'green'], example: 'gold' },
                        rating: { type: 'number', minimum: 0, maximum: 5, example: 4.5 },
                        author: { $ref: '#/components/schemas/UserPublic' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CreateProductRequest: {
                    type: 'object',
                    required: ['name', 'price', 'image'],
                    properties: {
                        name: { type: 'string', example: 'Silk Evening Dress' },
                        category: { type: 'string', enum: ['accessories', 'dress', 'jewellery', 'cosmetics'], example: 'dress' },
                        description: { type: 'string', example: 'Elegant silk evening dress in midnight blue' },
                        price: { type: 'number', example: 89.99 },
                        oldPrice: { type: 'number', example: 120.00 },
                        image: { type: 'string', example: 'https://res.cloudinary.com/...' },
                        color: { type: 'string', example: 'blue' },
                        author: { type: 'string', description: 'MongoDB ObjectId of the admin user', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
                    },
                },
                // ── ORDER ─────────────────────────────────────────────
                OrderProduct: {
                    type: 'object',
                    properties: {
                        productId: { type: 'string', example: 'prod_xyz123' },
                        quantity: { type: 'integer', example: 2 },
                    },
                },
                Order: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d3' },
                        orderId: { type: 'string', description: 'Stripe PaymentIntent ID', example: 'pi_3abc123' },
                        products: { type: 'array', items: { $ref: '#/components/schemas/OrderProduct' } },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        amount: { type: 'number', example: 299.98 },
                        status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'completed'], example: 'pending' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                CheckoutRequest: {
                    type: 'object',
                    required: ['products'],
                    properties: {
                        userId: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
                        products: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', example: 'Diamond Earrings' },
                                    image: { type: 'string', example: 'https://res.cloudinary.com/...' },
                                    price: { type: 'number', example: 149.99 },
                                    quantity: { type: 'integer', example: 1 },
                                },
                            },
                        },
                    },
                },
                UpdateOrderStatusRequest: {
                    type: 'object',
                    required: ['status'],
                    properties: {
                        status: { type: 'string', enum: ['pending', 'processing', 'shipped', 'completed'], example: 'shipped' },
                    },
                },
                // ── REVIEW ────────────────────────────────────────────
                Review: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d4' },
                        comment: { type: 'string', example: 'Absolutely love this product!' },
                        rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
                        userId: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
                        productId: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d2' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                PostReviewRequest: {
                    type: 'object',
                    required: ['comment', 'rating', 'userId', 'productId'],
                    properties: {
                        comment: { type: 'string', example: 'Great quality, fast shipping!' },
                        rating: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
                        userId: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d1' },
                        productId: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d2' },
                    },
                },
                // ── CONTACT ───────────────────────────────────────────
                ContactRequest: {
                    type: 'object',
                    required: ['name', 'email', 'subject', 'message'],
                    properties: {
                        name: { type: 'string', example: 'Jane Smith' },
                        email: { type: 'string', format: 'email', example: 'jane@example.com' },
                        subject: { type: 'string', enum: ['General Inquiry', 'Order Support', 'Return & Refund', 'Product Question', 'Partnership', 'Other'], example: 'Order Support' },
                        message: { type: 'string', minLength: 10, maxLength: 2000, example: 'I have a question about my recent order...' },
                    },
                },
                ContactMessage: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '64f1a2b3c4d5e6f7a8b9c0d5' },
                        name: { type: 'string', example: 'Jane Smith' },
                        email: { type: 'string', example: 'jane@example.com' },
                        subject: { type: 'string', example: 'Order Support' },
                        message: { type: 'string', example: 'I have a question about my recent order...' },
                        status: { type: 'string', enum: ['unread', 'read', 'replied'], example: 'unread' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                UpdateContactStatusRequest: {
                    type: 'object',
                    required: ['status'],
                    properties: {
                        status: { type: 'string', enum: ['unread', 'read', 'replied'], example: 'read' },
                    },
                },
                // ── SHARED ────────────────────────────────────────────
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string', example: 'Operation completed successfully' },
                        data: { type: 'object' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Something went wrong' },
                        error: { type: 'string', nullable: true, example: 'Detailed error message' },
                    },
                },
            },
            responses: {
                Unauthorized: {
                    description: 'Unauthorized — missing or invalid auth cookie',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                },
                Forbidden: {
                    description: 'Forbidden — admin role required',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                },
                NotFound: {
                    description: 'Resource not found',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                },
                ServerError: {
                    description: 'Internal server error',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
                },
            },
        },
    },
    apis: ['./src/docs/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

// ── CDN-based Swagger UI (bypasses swagger-ui-express static serving,
//    which breaks on Vercel serverless because swagger-ui-dist assets
//    often don't get bundled into the function) ─────────────────────────
const SWAGGER_UI_VERSION = '5.18.2';
const CDN_BASE = `https://cdn.jsdelivr.net/npm/swagger-ui-dist@${SWAGGER_UI_VERSION}`;

function buildSwaggerHtml(specUrl) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ShoppingMall API Docs</title>
  <link rel="stylesheet" href="${CDN_BASE}/swagger-ui.css" />
  <style>
    /* ── Reset & base ─────────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { overflow-y: scroll; }
    body { background: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }

    /* ── Topbar ─────────────────────────────────────────────────  */
    .swagger-ui .topbar {
      background: #ffffff !important;
      border-bottom: 2px solid #e2e8f0 !important;
      padding: 0 !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06) !important;
    }
    .swagger-ui .topbar .wrapper { padding: 12px 24px !important; display: flex; align-items: center; }
    .swagger-ui .topbar .download-url-wrapper { display: none !important; }
    /* Replace default Swagger logo with brand name */
    .swagger-ui .topbar-wrapper { display: flex; align-items: center; gap: 10px; }
    .swagger-ui .topbar-wrapper img { display: none !important; }
    .swagger-ui .topbar-wrapper::before {
      content: "ShoppingMall";
      color: #1e293b;
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .swagger-ui .topbar-wrapper::after {
      content: "API Docs";
      color: #e53e4d;
      font-size: 0.75rem;
      font-weight: 600;
      background: #fff0f2;
      border: 1px solid #fecdd3;
      padding: 2px 8px;
      border-radius: 20px;
      letter-spacing: 0.02em;
    }

    /* ── Main container ─────────────────────────────────────────  */
    .swagger-ui { background: #ffffff !important; }
    .swagger-ui .wrapper { max-width: 1100px; padding: 0 24px; }

    /* ── Info section ───────────────────────────────────────────  */
    .swagger-ui .info { margin: 32px 0 20px; }
    .swagger-ui .info .title {
      color: #0f172a !important;
      font-size: 2rem !important;
      font-weight: 800 !important;
      letter-spacing: -0.03em !important;
    }
    .swagger-ui .info .title small {
      background: #e53e4d !important;
      color: #fff !important;
      border-radius: 6px !important;
      padding: 2px 8px !important;
      font-size: 0.65em !important;
      vertical-align: middle !important;
    }
    .swagger-ui .info p,
    .swagger-ui .info li { color: #475569 !important; line-height: 1.7 !important; }
    .swagger-ui .info a { color: #2563eb !important; }
    .swagger-ui .info h2 { color: #1e293b !important; font-size: 1.1rem !important; margin-top: 16px !important; }
    .swagger-ui .info h3 { color: #334155 !important; }
    .swagger-ui .info pre,
    .swagger-ui .info code {
      background: #f1f5f9 !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 6px !important;
      color: #0f172a !important;
      font-size: 0.85em !important;
    }

    /* ── Server / scheme bar ────────────────────────────────────  */
    .swagger-ui .scheme-container {
      background: #ffffff !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 10px !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
      padding: 14px 20px !important;
      margin-bottom: 20px !important;
    }
    .swagger-ui .scheme-container .schemes { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .swagger-ui .scheme-container label { color: #64748b !important; font-size: 0.75rem !important; font-weight: 600 !important; text-transform: uppercase !important; letter-spacing: 0.06em !important; }
    .swagger-ui select {
      background: #ffffff !important;
      color: #0f172a !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 6px !important;
      padding: 6px 10px !important;
      font-size: 0.875rem !important;
    }
    .swagger-ui select:focus { outline: 2px solid #e53e4d !important; border-color: #e53e4d !important; }

    /* ── Tag / section headers ──────────────────────────────────  */
    .swagger-ui .opblock-tag {
      color: #0f172a !important;
      font-size: 1rem !important;
      font-weight: 700 !important;
      border-bottom: 2px solid #e2e8f0 !important;
      padding: 12px 4px !important;
      margin-top: 8px !important;
    }
    .swagger-ui .opblock-tag:hover { background: #f1f5f9 !important; border-radius: 8px !important; }
    .swagger-ui .opblock-tag small { color: #64748b !important; font-weight: 400 !important; font-size: 0.8rem !important; }

    /* ── Operation blocks ───────────────────────────────────────  */
    .swagger-ui .opblock {
      border-radius: 10px !important;
      border: 1px solid #e2e8f0 !important;
      margin-bottom: 8px !important;
      background: #ffffff !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
      overflow: hidden !important;
    }
    .swagger-ui .opblock:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; }
    .swagger-ui .opblock .opblock-summary { padding: 10px 16px !important; }
    .swagger-ui .opblock .opblock-summary-path { color: #1e293b !important; font-weight: 600 !important; font-size: 0.9rem !important; }
    .swagger-ui .opblock .opblock-summary-description { color: #64748b !important; font-size: 0.82rem !important; }

    /* ── HTTP Method badges ─────────────────────────────────────  */
    .swagger-ui .opblock .opblock-summary-method {
      border-radius: 6px !important;
      font-size: 0.72rem !important;
      font-weight: 700 !important;
      min-width: 70px !important;
      padding: 5px 8px !important;
      letter-spacing: 0.04em !important;
    }
    .swagger-ui .opblock.opblock-get    .opblock-summary-method { background: #2563eb !important; }
    .swagger-ui .opblock.opblock-post   .opblock-summary-method { background: #16a34a !important; }
    .swagger-ui .opblock.opblock-put    .opblock-summary-method { background: #d97706 !important; }
    .swagger-ui .opblock.opblock-patch  .opblock-summary-method { background: #7c3aed !important; }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #dc2626 !important; }

    .swagger-ui .opblock.opblock-get    { border-left: 4px solid #2563eb !important; }
    .swagger-ui .opblock.opblock-post   { border-left: 4px solid #16a34a !important; }
    .swagger-ui .opblock.opblock-put    { border-left: 4px solid #d97706 !important; }
    .swagger-ui .opblock.opblock-patch  { border-left: 4px solid #7c3aed !important; }
    .swagger-ui .opblock.opblock-delete { border-left: 4px solid #dc2626 !important; }

    /* Tinted background for GET/POST/etc summary row */
    .swagger-ui .opblock.opblock-get    .opblock-summary { background: #eff6ff !important; }
    .swagger-ui .opblock.opblock-post   .opblock-summary { background: #f0fdf4 !important; }
    .swagger-ui .opblock.opblock-put    .opblock-summary { background: #fffbeb !important; }
    .swagger-ui .opblock.opblock-patch  .opblock-summary { background: #f5f3ff !important; }
    .swagger-ui .opblock.opblock-delete .opblock-summary { background: #fef2f2 !important; }

    /* ── Expanded body ──────────────────────────────────────────  */
    .swagger-ui .opblock .opblock-body { background: #ffffff !important; }
    .swagger-ui .opblock-description-wrapper p,
    .swagger-ui table thead tr th,
    .swagger-ui table thead tr td,
    .swagger-ui .parameter__name,
    .swagger-ui .parameter__type,
    .swagger-ui .parameter__in,
    .swagger-ui .prop-type { color: #334155 !important; }
    .swagger-ui table tbody tr td { color: #475569 !important; }
    .swagger-ui table tbody tr:nth-child(odd) { background: #f5f5f5 !important; }
    .swagger-ui .response-col_status { color: #16a34a !important; font-weight: 600 !important; }
    .swagger-ui .response-col_description { color: #475569 !important; }
    .swagger-ui .tab li { color: #64748b !important; }
    .swagger-ui .tab li.active,
    .swagger-ui .tab li button.active { color: #e53e4d !important; border-bottom: 2px solid #e53e4d !important; }

    /* ── Buttons ────────────────────────────────────────────────  */
    .swagger-ui .btn.execute {
      background: #e53e4d !important;
      border-color: #e53e4d !important;
      color: #fff !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      padding: 8px 20px !important;
      transition: background 0.2s !important;
    }
    .swagger-ui .btn.execute:hover { background: #c53030 !important; }
    .swagger-ui .btn.cancel {
      border-color: #cbd5e1 !important;
      color: #64748b !important;
      border-radius: 8px !important;
    }
    .swagger-ui .btn.cancel:hover { background: #f1f5f9 !important; }
    .swagger-ui .btn.authorize {
      background: #fff !important;
      border: 2px solid #16a34a !important;
      color: #16a34a !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
    }
    .swagger-ui .btn.authorize svg { fill: #16a34a !important; }
    .swagger-ui .btn.authorize:hover { background: #f0fdf4 !important; }

    /* ── Inputs / textarea ──────────────────────────────────────  */
    .swagger-ui textarea,
    .swagger-ui .body-param__text {
      background: #ffffff !important;
      color: #0f172a !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 8px !important;
      font-size: 0.875rem !important;
    }
    .swagger-ui textarea:focus { outline: 2px solid #e53e4d !important; border-color: #e53e4d !important; }
    .swagger-ui input[type=text],
    .swagger-ui input[type=password],
    .swagger-ui input[type=email],
    .swagger-ui input[type=file] {
      background: #ffffff !important;
      color: #0f172a !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 6px !important;
    }
    .swagger-ui input:focus { outline: 2px solid #e53e4d !important; }

    /* ── Code / response blocks ─────────────────────────────────  */
    .swagger-ui .responses-inner { background: #ffffff !important; }
    .swagger-ui .microlight,
    .swagger-ui .highlight-code pre {
      background: #f1f5f9 !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 8px !important;
      color: #0f172a !important;
      font-size: 0.82rem !important;
    }
    .swagger-ui .curl { background: #f1f5f9 !important; color: #0f172a !important; border-radius: 6px !important; }
    .swagger-ui .request-url { background: #f1f5f9 !important; color: #1e293b !important; border-radius: 6px !important; font-weight: 500 !important; }

    /* ── Models ─────────────────────────────────────────────────  */
    .swagger-ui section.models {
      background: #ffffff !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: 10px !important;
    }
    .swagger-ui section.models h4 { color: #0f172a !important; }
    .swagger-ui .model-title { color: #334155 !important; }
    .swagger-ui .model { color: #475569 !important; }
    .swagger-ui .model-box { background: #ffffff !important; border-radius: 6px !important; }
    .swagger-ui .prop-type { color: #2563eb !important; }
    .swagger-ui .prop-format { color: #7c3aed !important; }

    /* ── Dividers & misc ────────────────────────────────────────  */
    .swagger-ui .opblock-tag-section { margin-bottom: 16px !important; }
    .swagger-ui hr { border-color: #e2e8f0 !important; }
    .swagger-ui .markdown p { color: #475569 !important; }
    .swagger-ui .markdown code {
      background: #f1f5f9 !important;
      border: 1px solid #e2e8f0 !important;
      color: #e53e4d !important;
      border-radius: 4px !important;
      padding: 1px 5px !important;
    }

    /* ── Scrollbar ──────────────────────────────────────────────  */
    ::-webkit-scrollbar { width: 7px; height: 7px; }
    ::-webkit-scrollbar-track { background: #f1f5f9; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${CDN_BASE}/swagger-ui-bundle.js"></script>
  <script src="${CDN_BASE}/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      // Auto-swap localhost → production when accessed on the production domain
      var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      var requestInterceptor = function (req) {
        if (!isLocal && req.url.includes('localhost:5000')) {
          req.url = req.url.replace('http://localhost:5000', 'https://shopping-mall-backend.vercel.app');
        }
        return req;
      };

      SwaggerUIBundle({
        url: "${specUrl}",
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: "StandaloneLayout",
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "none",
        filter: true,
        tagsSorter: "alpha",
        withCredentials: true,
        requestInterceptor: requestInterceptor,
      });
    };
  </script>
</body>
</html>`;
}

function setupSwagger(app) {
    app.get('/api-docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    app.get('/api-docs', (_req, res) => {
        res.setHeader('Content-Type', 'text/html');
        res.send(buildSwaggerHtml('/api-docs.json'));
    });

    app.get('/api-docs/', (_req, res) => res.redirect('/api-docs'));
}

module.exports = { setupSwagger, swaggerSpec };