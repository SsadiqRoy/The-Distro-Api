const dotenv = require('dotenv');
const path = require('node:path');
const mongoose = require('mongoose');
const { promisify } = require('node:util');

process.on('uncaughtException', (error) => {
  console.log('🔥🔥 Uncaught Exception', error);
  process.exit(1);
});

dotenv.config({ path: path.join(__dirname, 'config.env') });

async function connectDB() {
  try {
    await mongoose.connect(process.env.db, { dbName: 'The-Distro'});
      // rejectUnauthorized: true,
      // useUnifiedTopology: true,
      // useNewUrlParser: true,

    console.log('👉 Database connected');
  } catch (error) {
    console.log('🔥🔥 Database connection error', error);
  }
}
connectDB();

/*




*/

const app = require('./app');

const server = app.listen(process.env.PORT, process.env.HOST, () =>
  console.log(`👍 The Distro Server Started at ${process.env.PORT}...`)
);

process.on('unhandledRejection', (reason) => {
  console.log('🔥🔥 Unhandled Rejection', reason);
  server.close(() => process.exit(1));
});
