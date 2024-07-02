const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

const globalError = require('./utilities/globalError');
const { isLoggedIn } = require('./middlewares/globalMiddleware');
const userRoutes = require('./routes/userRoutes');

app.use(isLoggedIn);
app.use('/api/admins', userRoutes);

app.use('*', (req, res) => {
  res.status(200).json({
    status: 'Not Found',
    message: 'No url found for ' + req.originalUrl,
    method: req.method,
  });
});

app.use(globalError);

module.exports = app;
