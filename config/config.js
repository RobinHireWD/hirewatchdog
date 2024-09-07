require('dotenv').config({ path: '../backend/config.env' }); // Adjust path as needed

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Robin123',
    database: process.env.DB_NAME || 'hirewatchdog_db',
    host: process.env.DB_HOST || 'localhost', // Use 'localhost' or '::1' if needed
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Robin123',
    database: process.env.DB_NAME || 'hirewatchdog_db',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'Robin123',
    database: process.env.DB_NAME || 'hirewatchdog_db',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
};
