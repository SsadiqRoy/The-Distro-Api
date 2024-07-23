const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('node:path');

const app = express();
const origin = ['http://localhost:5173', 'https://the-distro.vercel.app'];

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin, credentials: true }));

const globalError = require('./utilities/globalError');
const { isLoggedIn } = require('./middlewares/globalMiddleware');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const supplyRoutes = require('./routes/supplyRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const walletRoutes = require('./routes/walletRoutes');
const zeroRoutes = require('./routes/zeroRoutes');

app.get('/', (req, res) => {
  res.redirect('/api/products');
});

app.use(isLoggedIn);
app.use('/api/admins', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/supplies', supplyRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/zero', zeroRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'Not Found',
    message: 'No url found for ' + req.originalUrl,
    method: req.method,
  });
});

app.use(globalError);

module.exports = app;
