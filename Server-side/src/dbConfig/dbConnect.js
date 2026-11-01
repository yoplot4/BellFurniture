import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,                 // 💡 ተስተካከለ
  password: process.env.DB_PASSWORD || "",  
  database: process.env.DB_NAME,             // 💡 ተስተካከለ
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10, // 💡 ተስተካከለ
  queueLimit: Number(process.env.DB_QUEUE_LIMIT) || 0,           // 💡 ተስተካከለ
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTION === "true", // 💡 ተስተካከለ
  charset: process.env.DB_CHARSET || "utf8mb4"  
});

export const dbExcute = async (query, values = []) => {
  try {
    const [result] = await pool.execute(query, values);
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};
