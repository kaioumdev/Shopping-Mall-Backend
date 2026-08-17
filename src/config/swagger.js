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
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; }
    html { overflow-y: scroll; }

    /* ── Topbar ── */
    .swagger-ui .topbar {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      padding: 10px 0;
    }
    .swagger-ui .topbar .download-url-wrapper { display: none; }
    .swagger-ui .topbar-wrapper img { content: url(''); }
    .swagger-ui .topbar-wrapper::before {
      content: "ShoppingMall API";
      color: #f1f5f9;
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    /* ── Main wrapper ── */
    .swagger-ui { background: #0f172a; }
    .swagger-ui .wrapper { padding: 0 16px; }

    /* ── Info block ── */
    .swagger-ui .info { margin: 32px 0 24px; }
    .swagger-ui .info .title {
      color: #f1f5f9 !important;
      font-size: 2.25rem !important;
      font-weight: 800 !important;
    }
    .swagger-ui .info .title small { background: #ed3849; color: #fff; border-radius: 4px; }
    .swagger-ui .info p,
    .swagger-ui .info li,
    .swagger-ui .info table { color: #94a3b8 !important; }
    .swagger-ui .info a { color: #60a5fa !important; }
    .swagger-ui .info h2,
    .swagger-ui .info h3 { color: #e2e8f0 !important; }
    .swagger-ui .info pre {
      background: #1e293b !important;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      color: #7dd3fc !important;
    }

    /* ── Server selector ── */
    .swagger-ui .scheme-container {
      background: #1e293b !important;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      box-shadow: none;
      padding: 14px 20px;
    }
    .swagger-ui .scheme-container label { color: #94a3b8 !important; }
    .swagger-ui select {
      background: #0f172a !important;
      color: #e2e8f0 !important;
      border: 1px solid rgba(255,255,255,0.12) !important;
      border-radius: 6px !important;
    }

    /* ── Tags / section headers ── */
    .swagger-ui .opblock-tag {
      color: #e2e8f0 !important;
      border-bottom: 1px solid rgba(255,255,255,0.06) !important;
      font-size: 1.1rem !important;
    }
    .swagger-ui .opblock-tag:hover { background: rgba(255,255,255,0.02) !important; }

    /* ── Operation blocks ── */
    .swagger-ui .opblock {
      border-radius: 10px !important;
      border: 1px solid rgba(255,255,255,0.07) !important;
      margin-bottom: 8px !important;
      background: #1e293b !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
    }
    .swagger-ui .opblock .opblock-summary { border-radius: 10px !important; }
    .swagger-ui .opblock .opblock-summary-description { color: #94a3b8 !important; }
    .swagger-ui .opblock .opblock-summary-path { color: #e2e8f0 !important; }

    /* ── Method badges ── */
    .swagger-ui .opblock.opblock-get    .opblock-summary-method { background: #3b82f6 !important; border-radius: 6px !important; }
    .swagger-ui .opblock.opblock-post   .opblock-summary-method { background: #22c55e !important; border-radius: 6px !important; }
    .swagger-ui .opblock.opblock-put    .opblock-summary-method { background: #f59e0b !important; border-radius: 6px !important; }
    .swagger-ui .opblock.opblock-patch  .opblock-summary-method { background: #a78bfa !important; border-radius: 6px !important; }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #ef4444 !important; border-radius: 6px !important; }

    .swagger-ui .opblock.opblock-get    { border-left: 3px solid #3b82f6 !important; }
    .swagger-ui .opblock.opblock-post   { border-left: 3px solid #22c55e !important; }
    .swagger-ui .opblock.opblock-put    { border-left: 3px solid #f59e0b !important; }
    .swagger-ui .opblock.opblock-patch  { border-left: 3px solid #a78bfa !important; }
    .swagger-ui .opblock.opblock-delete { border-left: 3px solid #ef4444 !important; }

    /* ── Expanded opblock body ── */
    .swagger-ui .opblock .opblock-body { background: #0f172a !important; border-radius: 0 0 10px 10px !important; }
    .swagger-ui .opblock-description-wrapper p,
    .swagger-ui .opblock-external-docs-wrapper p,
    .swagger-ui .opblock-title_normal p,
    .swagger-ui table thead tr td,
    .swagger-ui table thead tr th,
    .swagger-ui .parameter__name,
    .swagger-ui .parameter__type,
    .swagger-ui .parameter__deprecated,
    .swagger-ui .parameter__in,
    .swagger-ui .prop-type,
    .swagger-ui .response-col_status,
    .swagger-ui .response-col_description { color: #94a3b8 !important; }
    .swagger-ui .tab li { color: #94a3b8 !important; }
    .swagger-ui .tab li.active { color: #60a5fa !important; }

    /* ── Execute button ── */
    .swagger-ui .btn.execute {
      background: #ed3849 !important;
      border-color: #ed3849 !important;
      color: #fff !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      padding: 8px 20px !important;
    }
    .swagger-ui .btn.execute:hover { background: #d23141 !important; }
    .swagger-ui .btn.cancel {
      border-color: rgba(255,255,255,0.15) !important;
      color: #94a3b8 !important;
      border-radius: 8px !important;
    }
    .swagger-ui .btn.authorize {
      background: transparent !important;
      border: 1px solid #22c55e !important;
      color: #22c55e !important;
      border-radius: 8px !important;
    }
    .swagger-ui .btn.authorize svg { fill: #22c55e !important; }

    /* ── Textareas / code areas ── */
    .swagger-ui textarea,
    .swagger-ui .body-param__text {
      background: #1e293b !important;
      color: #e2e8f0 !important;
      border: 1px solid rgba(255,255,255,0.10) !important;
      border-radius: 8px !important;
    }
    .swagger-ui input[type=text],
    .swagger-ui input[type=password],
    .swagger-ui input[type=email],
    .swagger-ui input[type=file] {
      background: #1e293b !important;
      color: #e2e8f0 !important;
      border: 1px solid rgba(255,255,255,0.10) !important;
      border-radius: 6px !important;
    }

    /* ── Response block ── */
    .swagger-ui .responses-inner { background: #0f172a !important; }
    .swagger-ui .response-col_status { color: #4ade80 !important; }
    .swagger-ui .microlight,
    .swagger-ui .highlight-code { background: #1e293b !important; border-radius: 6px !important; color: #7dd3fc !important; }
    .swagger-ui .curl { background: #1e293b !important; color: #7dd3fc !important; }
    .swagger-ui .request-url { background: #1e293b !important; color: #a5f3fc !important; }

    /* ── Models section ── */
    .swagger-ui section.models { background: #1e293b !important; border: 1px solid rgba(255,255,255,0.06) !important; border-radius: 10px !important; }
    .swagger-ui section.models h4 { color: #e2e8f0 !important; }
    .swagger-ui .model-title { color: #94a3b8 !important; }
    .swagger-ui .model { color: #94a3b8 !important; }
    .swagger-ui .model-box { background: #0f172a !important; border-radius: 6px !important; }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #0f172a; }
    ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${CDN_BASE}/swagger-ui-bundle.js"></script>
  <script src="${CDN_BASE}/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      // Automatically pick the right server based on where the page is loaded from.
      // If accessed on localhost, default to the local server; otherwise use production.
      var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      var requestInterceptor = function(request) {
        // If the request URL still points to localhost but we're on production, swap it
        if (!isLocal && request.url.includes('localhost:5000')) {
          request.url = request.url.replace('http://localhost:5000', 'https://shopping-mall-backend.vercel.app');
        }
        return request;
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