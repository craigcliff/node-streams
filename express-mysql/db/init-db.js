const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function initDatabase() {
  try {
    const connection = await pool.getConnection();

    await connection.query("CREATE DATABASE IF NOT EXISTS my_app;");
    await connection.query("USE my_app;");

    connection.release();
    console.log("Database created and connected");
  } catch (error) {
    console.error("Error creating Database: ", error);
  }
}

module.exports = {
  pool,
  initDatabase,
};
