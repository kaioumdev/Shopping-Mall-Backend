const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const { setupSwagger } = require('./src/config/swagger');

// ── Serverless-safe MongoDB connection ────────────────────────────────────
// Defined first so the guard middleware can be registered before any routes.
// On Vercel, each cold-start runs this module fresh. We keep a module-level
// promise so concurrent in-flight requests share one connect() call instead
// of racing to open multiple connections.
let connectionPromise = null;

async function connectDB() {
  // Already connected — nothing to do.
  if (mongoose.connection.readyState === 1) return;

  // Connection in progress — wait for the existing attempt.
  if (connectionPromise) return connectionPromise;

  connectionPromise = mongoose
    .connect(process.env.UB_URL, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 30000,
      directConnection: false,
    })
    .then(() => {
      console.log("MongoDB connected successfully!");
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err.message);
    })
    .finally(() => {
      // Reset so the next request can retry if this attempt failed.
      connectionPromise = null;
    });

  return connectionPromise;
}

// Kick off connection on cold start so it is ready before the first request.
connectDB();

// ── Core middleware ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: [
    'https://shopping-mall-frontend-nine.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
app.use(cookieParser());

// ── Swagger docs ───────────────────────────────────────────────────────────
setupSwagger(app);

// ── DB guard — runs before every API route ────────────────────────────────
// Ensures the DB connection is live before any handler touches Mongoose.
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please try again shortly.',
    });
  }
  next();
});

// ── Root health-check ──────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).send(
    "ShoppingMall E-commerce Backend Server is running successfully! 🚀"
  );
});

const UploadImage = require("./src/utilis/UploadImage");

// ── Routes ─────────────────────────────────────────────────────────────────
const userRoutes     = require("./src/users/user.route");
const productsRoutes = require('./src/products/product.route');
const reviewsRoutes  = require('./src/reviews/review.route');
const ordersRoutes   = require("./src/orders/order.route");
const statsRoutes    = require("./src/stats/stats.route");
const contactRoutes  = require("./src/contact/contact.route");

app.use('/api/auth',     userRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/reviews",  reviewsRoutes);
app.use("/api/orders",   ordersRoutes);
app.use("/api/stats",    statsRoutes);
app.use("/api/contact",  contactRoutes);

// Upload image
app.post('/uploadImage', (req, res) => {
  UploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((error) => res.status(500).send(error));
});

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ───────────────────────────────────────────────────
// Must be the last app.use() and must have 4 params for Express to treat it
// as an error handler.
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
