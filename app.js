const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('node:path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

const globalError = require('./utilities/globalError');
const { isLoggedIn } = require('./middlewares/globalMiddleware');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const supplyRoutes = require('./routes/supplyRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const walletRoutes = require('./routes/walletRoutes');

app.use(isLoggedIn);
app.use('/api/admins', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/supplies', supplyRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/wallet', walletRoutes);

app.use('*', (req, res) => {
  res.status(200).json({
    status: 'Not Found',
    message: 'No url found for ' + req.originalUrl,
    method: req.method,
  });
});

app.use(globalError);

module.exports = app;