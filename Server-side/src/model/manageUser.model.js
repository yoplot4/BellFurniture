import { dbExcute } from "../dbConfig/dbConnect.js";

const getAllUserModel = async () => {
	try {
		const sql = `SELECT 
                  id, firstname, lastname, email, role, created_at  
                  FROM users `;

		const data = await dbExcute(sql);

		return data;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};

const updateUserModel = async (userId, updatedFields) => {
	try {
		// Only allow these database columns to be updated
		const allowedFields = [
			"firstname",
			"lastname",
			"email",
			"role",
			"password_hash",
		];

		const fields = [];
		const values = [];

		// Build dynamic UPDATE query
		Object.entries(updatedFields).forEach(([key, value]) => {
			if (
				allowedFields.includes(key) &&
				value !== undefined &&
				value !== null
			) {
				fields.push(`\`${key}\` = ?`);
				values.push(value);
			}
		});

		// Check whether there are valid fields
		if (fields.length === 0) {
			throw new Error("No valid fields provided for update.");
		}

		// Add user ID to values
		values.push(userId);

		// Construct SQL query
		const sql = `
            UPDATE users
            SET ${fields.join(", ")}
            WHERE id = ?
        `;

		// Execute query
		const result = await dbExcute(sql, values);

		return result;
	} catch (error) {
		console.error("Error updating user:", error);
		throw error;
	}
};


const deleteUserModel = async (userId) => {
  try {
    const sql = `DELETE FROM users WHERE id = ?`;

    // mysql2 accepts an array of parameter values
    const values = [userId];

    const result = await dbExcute(sql, values);

    return result;
  } catch (error) {
    console.error("Database error while deleting user:", error);
    throw error;
  }
};



export { getAllUserModel, updateUserModel, deleteUserModel };
