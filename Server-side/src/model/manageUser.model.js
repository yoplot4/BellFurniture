import { dbExcute } from '../dbConfig/dbConnect.js';

const getAllUserModel = async () => {
  try {
    const sql = `SELECT 
                  id, firstname, lastname, email, role, created_at  
                  FROM users `;

    const data = await dbExcute(sql);

    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export { getAllUserModel };