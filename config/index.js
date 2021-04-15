const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT,
  ACCESS_KEY_ID:process.env.ACCESS_KEY_ID,
  SECRET_ACCESS_KEY:process.env.SECRET_ACCESS_KEY,
  BUCKET:process.env.BUCKET
};