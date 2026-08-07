const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/config/swagger');

// middleware
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.json({ limit: '10mb' }))

// ── Swagger UI ────────────────────────────────────────────────────────────────
const swaggerUiOptions = {
  customSiteTitle: 'ShoppingMall API Docs',
  customCss: `
    .swagger-ui .topbar { background: #111111; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .swagger-ui .topbar-wrapper img { display: none; }
    .swagger-ui .topbar-wrapper::before {
      content: 'ShoppingMall Shopping Mall API';
      color: #ffffff;
      font-size: 1.4rem;
      font-weight: 800;
      font-family: serif;
    }
    .swagger-ui .topbar-wrapper span { color: #ed3849; }
    .swagger-ui { background: #0d0d0d; }
    .swagger-ui .info { margin: 30px 0; }
    .swagger-ui .info .title { color: #ffffff; font-size: 2rem; }
    .swagger-ui .info p, .swagger-ui .info li, .swagger-ui .info table { color: #aaaaaa; }
    .swagger-ui .scheme-container { background: #111111; box-shadow: none; border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; }
    .swagger-ui .opblock-tag { color: #ffffff; border-color: rgba(255,255,255,0.08); }
    .swagger-ui .opblock { border-radius: 8px; margin-bottom: 6px; border: 1px solid rgba(255,255,255,0.06); }
    .swagger-ui .opblock .opblock-summary { border-radius: 8px; }
    .swagger-ui section.models { border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; }
    .swagger-ui section.models .model-container { background: #1a1a1a; }
    .swagger-ui .btn.authorize { background: #ed3849; border-color: #ed3849; color: #fff; border-radius: 6px; }
    .swagger-ui .btn.authorize svg { fill: #fff; }
    .swagger-ui select, .swagger-ui input[type=text], .swagger-ui textarea { background: #1a1a1a; color: #fff; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; }
  `,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    tryItOutEnabled: true,
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

// Serve raw OpenAPI JSON spec
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
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
    await mongoose.connect(process.env.UB_URL);
    console.log("mongodbAtlas", process.env.UB_URL);
 
    app.get('/', (req, res) => {
      res.send('ShoppingMall E-commerce Server is running!')
    })
}


main().then(() => console.log("Mongodb connected successfuly!")).catch(err => console.log(err));


// upload image api
app.post('/uploadImage',  (req, res) => {
  UploadImage(req.body.image)
  .then((url) => res.send(url))
  .catch((error) => res.status(500).send(error));
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})