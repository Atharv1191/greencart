const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./configs/db");
const UserRoute = require('./routes/userRoute');
const sellerRoute = require('./routes/sellerRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoute');
const addressRoute = require('./routes/addressRoute');
const orderRoute = require('./routes/orderRoute');
const connectCloudinary = require("./configs/cloudinary");
const { StripeWebhooks } = require("./controllers/orderController");

require('dotenv').config();
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://greencaart.vercel.app'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ✅ DB and Cloudinary setup
connectDB();
connectCloudinary();

// ✅ Stripe webhook (must come before express.json())
app.post('/stripe', express.raw({ type: 'application/json' }), StripeWebhooks);

// ✅ Then JSON and cookies
app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.get('/', (req, res) => {
  res.send('API is working');
});

app.use('/api/user', UserRoute);
app.use('/api/seller', sellerRoute);
app.use('/api/product', productRoute);
app.use('/api/cart', cartRoute);
app.use('/api/address', addressRoute);
app.use('/api/order', orderRoute);

// ✅ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
