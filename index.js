const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const { setupSwagger } = require('./src/config/swagger');


// middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: ['https://shopping-mall-frontend-nine.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '10mb' }))

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


async function main() {
  try {
    await mongoose.connect(process.env.UB_URL);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

main();


// upload image api
app.post('/uploadImage',  (req, res) => {
  UploadImage(req.body.image)
  .then((url) => res.send(url))
  .catch((error) => res.status(500).send(error));
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})