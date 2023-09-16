const mysql = require("mysql2/promise");
const { generateDummyData } = require("./faker");
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

    await connection.query("DROP TABLE IF EXISTS users");

    // Create user table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        avatar VARCHAR(255),
        birthday VARCHAR(255),
        firstname VARCHAR(255),
        lastname VARCHAR(255),
        sex ENUM('Male', 'Female', 'Other'),
        email VARCHAR(255) NOT NULL,
        age INT,
        jobTitle VARCHAR(255),
        subscriptionTier VARCHAR(255)
      );
    `);

    const [existingRows] = await connection.query(
      "SELECT COUNT(*) as count FROM users"
    );
    existingRecordCount = existingRows[0].count;

    if (existingRecordCount === 0) {
      const dummyData = generateDummyData();

      const insertQuery =
        "INSERT INTO users (avatar, birthday, firstname, lastname, sex, email, age, jobTitle, subscriptionTier) VALUES ?";
      await connection.query(insertQuery, [
        dummyData.map((record) => [
          record.avatar,
          record.birthday,
          record.firstName,
          record.lastName,
          record.sex,
          record.email,
          record.age,
          record.jobTitle,
          record.subscriptionTier,
        ]),
      ]);

      console.log("Database created, connected, and dummy data inserted");
    } else {
      console.log("Database already contains data, skipping insertion");
    }
    connection.release();
    console.log("Database initiliazed successfully");
  } catch (error) {
    console.error("Error creating Database: ", error);
  }
}

module.exports = {
  pool,
  initDatabase,
};
