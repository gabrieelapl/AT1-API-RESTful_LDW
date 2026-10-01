require('dotenv').config();

const isSSL = process.env.DB_SSL === 'true';

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'senha1234',
    database: process.env.DB_NAME || 'catalogo_filmes',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433', 10),
    dialect: 'postgres',
    dialectOptions: isSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      : {}
  }
};