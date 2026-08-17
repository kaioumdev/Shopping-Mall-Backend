const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const { setupSwagger } = require('./src/config/swagger');

// middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: ['https://shopping-mall-frontend-nine.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))
app.use(cookieParser())

setupSwagger(app);

app.get("/", (req, res) => {
  res.status(200).send(
    "ShoppingMall E-commerce Backend Server is running successfully! 🚀"
  );
});

const UploadImage = require("./src/utilis/UploadImage")

// routes
const userRoutes = require("./src/users/user.route");
const productsRoutes = require('./src/products/product.route')
const reviewsRoutes = require('./src/reviews/review.route')
const ordersRoutes = require("./src/orders/order.route");
const statsRoutes = require("./src/stats/stats.route")
const contactRoutes = require("./src/contact/contact.route")

app.use('/api/auth', userRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/reviews", reviewsRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/contact", contactRoutes);

// upload image api
app.post('/uploadImage', (req, res) => {
  UploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((error) => res.status(500).send(error));
})

// ── 404 handler — matches your response envelope ──────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler — catches anything thrown/rejected in routes ─────
// This must be the LAST app.use() call, and must have 4 params for Express
// to recognize it as an error handler.
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ── MongoDB connection (serverless-safe) ───────────────────────────────────
// mongoose.connection.readyState values: 0 = disconnected, 1 = connected,
// 2 = connecting, 3 = disconnecting. We only call connect() if we're not
// already connected or connecting — this avoids duplicate connection
// attempts when Vercel reuses a warm function instance.
let isConnecting = false;

async function connectDB() {
  if (mongoose.connection.readyState === 1 || isConnecting) return;

  isConnecting = true;
  try {
    await mongoose.connect(process.env.UB_URL, {
      serverSelectionTimeoutMS: 8000, // fail fast instead of hanging ~30s
      socketTimeoutMS: 20000,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // Don't throw here — let individual requests fail with a clear 500
    // via the global error handler above, instead of crashing the whole
    // serverless function on cold start.
  } finally {
    isConnecting = false;
  }
}

// Kick off the connection attempt immediately on module load (cold start),
// and also before each request in case the connection dropped.
connectDB();

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }
  // If still not connected after retry, return a clear 503 so the
  // client gets a meaningful error instead of a cryptic 500.
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please try again shortly.',
    });
  }
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;