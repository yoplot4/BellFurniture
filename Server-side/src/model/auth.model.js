// 1. Clean independent import statement
import { dbExcute } from '../dbConfig/dbConnect.js';

// 2. Exported model function with balanced brackets
export const registerModel = async (firstname, lastname, email, password) => {
  try {
    // This is where you will eventually call dbExcute()
    const query= `INSERT INTO users(firstname, lastname, email, password, role) VALUES(?,?,?,?,?)`;
    const values= [firstname, lastname, email, password, 'customer'];
    const result= await dbExcute(query, values);
    return result; 
  } catch (error) {
     // Log the error locally for system administrators to trace
    console.error('Database Error in registerModel:', error.message);
    
    // Bubble the error up to the controller's try/catch block so it can handle ER_DUP_ENTRY
    throw error;
  }
}; // <-- Safely closed

export const loginModel= async (email)=>{
  try {
    const sql = `SELECT id, firstname, lastname, email, password, role
      FROM users 
      WHERE email=?`;
    const value=[email]
    const result=await dbExcute(sql, value);
    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
  } catch (error) {
    throw error
  }
}
