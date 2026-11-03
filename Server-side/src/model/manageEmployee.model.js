import { pool, dbExcute } from "../dbConfig/dbConnect.js";

const registerEmployeeModel = async (employeeData) => {
	let connection;
	let transactionStarted = false;

	try {
		// 1. Get a dedicated database connection
		connection = await pool.getConnection();

		// 2. Start transaction
		await connection.beginTransaction();
		transactionStarted = true;

		// 3. Insert employee account into users table
		const userSql = `
      INSERT INTO users (
        firstname,
        lastname,
        email,
        password,
        role
        
      )
      VALUES (?, ?, ?, ?, ?)
    `;

		const userValues = [
			employeeData.firstName,
			employeeData.lastName,
			employeeData.Email,
			employeeData.password,
			employeeData.role,
		];

		const [userResult] = await connection.execute(userSql, userValues);

		// Get newly generated user ID
		const userId = userResult.insertId;

		// 4. Insert employee contact details
		const detailsSql = `
      INSERT INTO user_details (
        user_id,
        phone_number,
        national_id,
        kebele_id
      )
      VALUES (?, ?, ?, ?)
    `;

		const detailsValues = [
			userId,
			employeeData.phoneNumber,
			employeeData.nationalId,
			employeeData.kebeleId,
		];

		await connection.execute(detailsSql, detailsValues);

		// 5. Insert employee employment details
		const employeeSql = `
      INSERT INTO employees (
        user_id,
        bank_account,
        guarantor_name,
        guarantor_phone,
        start_date
      )
      VALUES (?, ?, ?, ?, ?)
    `;

		const employeeValues = [
			userId,
			employeeData.bankAccount,
			employeeData.guarantorName,
			employeeData.guarantorPhone,
			employeeData.startDate,
		];

		const [employeeResult] = await connection.execute(
			employeeSql,
			employeeValues,
		);

		// 6. Commit all database operations
		await connection.commit();
		transactionStarted = false;

		// 7. Return safe employee information
		return {
			userId,
			employeeId: employeeResult.insertId,
			firstName: employeeData.firstName,
			lastName: employeeData.lastName,
			email: employeeData.Email,
			role: employeeData.role,
		};
	} catch (error) {
		// 8. Rollback if any database operation fails
		if (connection && transactionStarted) {
			try {
				await connection.rollback();
			} catch (rollbackError) {
				console.error("Transaction rollback error:", rollbackError);
			}
		}

		// Pass the original error to controller
		throw error;
	} finally {
		// 9. Always release connection back to pool
		if (connection) {
			connection.release();
		}
	}
};

const getAllEmployeesModel = async () => {
	try {
		const sql = `
      SELECT
        u.id AS userId,
        u.firstname AS firstName,
        u.lastname AS lastName,
        u.email AS email,
        u.role AS role,
        u.created_at AS createdAt,

        ud.phone_number AS phoneNumber,
        ud.national_id AS nationalId,
        ud.kebele_id AS kebeleId,

        e.id AS employeeId,
        e.bank_account AS bankAccount,
        e.guarantor_name AS guarantorName,
        e.guarantor_phone AS guarantorPhone,
        e.start_date AS startDate,
        e.status AS status

      FROM users u

      INNER JOIN user_details ud
        ON u.id = ud.user_id

      INNER JOIN employees e
        ON u.id = e.user_id

      WHERE u.role = ?

      ORDER BY u.created_at DESC
    `;

		const employees = await dbExcute(sql, ["employee"]);

		return employees;
	} catch (error) {
		throw error;
	}
};

// UPDATE EMPLOYEE


const updateEmployeeModel = async (userId, employeeData) => {
  let connection;

  try {
    connection = await pool.getConnection();

    await connection.beginTransaction();

    // Check whether employee exists
    const [userRows] = await connection.execute(
      `SELECT id FROM users
       WHERE id = ? AND role = 'employee'
       FOR UPDATE`,
      [userId]
    );

    if (userRows.length === 0) {
      await connection.rollback();
      return null;
    }

    // Update users table
    const userFields = {
      firstName: "firstname",
      lastName: "lastname",
      Email: "email"
    };

    const userUpdates = [];
    const userValues = [];

    for (const [key, column] of Object.entries(userFields)) {
      if (employeeData[key] !== undefined) {
        userUpdates.push(`${column} = ?`);
        userValues.push(employeeData[key]);
      }
    }

    if (userUpdates.length > 0) {
      userValues.push(userId);

      await connection.execute(
        `UPDATE users SET ${userUpdates.join(", ")}
         WHERE id = ?`,
        userValues
      );
    }

    // Update user_details table
    const detailsFields = {
      phoneNumber: "phone_number",
      nationalId: "national_id",
      kebeleId: "kebele_id"
    };

    const detailsUpdates = [];
    const detailsValues = [];

    for (const [key, column] of Object.entries(detailsFields)) {
      if (employeeData[key] !== undefined) {
        detailsUpdates.push(`${column} = ?`);
        detailsValues.push(employeeData[key]);
      }
    }

    if (detailsUpdates.length > 0) {
      detailsValues.push(userId);

      await connection.execute(
        `UPDATE user_details SET ${detailsUpdates.join(", ")}
         WHERE user_id = ?`,
        detailsValues
      );
    }

    // Update employees table
    const employeeFields = {
      bankAccount: "bank_account",
      guarantorName: "guarantor_name",
      guarantorPhone: "guarantor_phone",
      startDate: "start_date",
      status: "status"
    };

    const employeeUpdates = [];
    const employeeValues = [];

    for (const [key, column] of Object.entries(employeeFields)) {
      if (employeeData[key] !== undefined) {
        employeeUpdates.push(`${column} = ?`);
        employeeValues.push(employeeData[key]);
      }
    }

    if (employeeUpdates.length > 0) {
      employeeValues.push(userId);

      await connection.execute(
        `UPDATE employees SET ${employeeUpdates.join(", ")}
         WHERE user_id = ?`,
        employeeValues
      );
    }

    await connection.commit();

    // Retrieve the complete updated employee
const [updatedEmployees] = await connection.execute(
  `
    SELECT
      u.id AS userId,
      u.firstname AS firstName,
      u.lastname AS lastName,
      u.email AS email,
      u.role AS role,
      u.created_at AS createdAt,

      ud.phone_number AS phoneNumber,
      ud.national_id AS nationalId,
      ud.kebele_id AS kebeleId,

      e.id AS employeeId,
      e.bank_account AS bankAccount,
      e.guarantor_name AS guarantorName,
      e.guarantor_phone AS guarantorPhone,
      e.start_date AS startDate,
      e.status AS status

    FROM users u

    INNER JOIN user_details ud
      ON u.id = ud.user_id

    INNER JOIN employees e
      ON u.id = e.user_id

    WHERE u.id = ?
      AND u.role = 'employee'
  `,
  [userId]
);

return updatedEmployees[0] || null;

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    throw error;

  } finally {
    if (connection) {
      connection.release();
    }
  }
};


const deleteEmployeeModel = async (userId) => {
  const sql = `
    DELETE FROM users
    WHERE id = ? AND role = 'employee'
  `;

  const result = await dbExcute(sql, [userId]);

  if (result.affectedRows === 0) {
    return null;
  }

  return {
    userId,
    affectedRows: result.affectedRows
  };
};




export { registerEmployeeModel, getAllEmployeesModel, updateEmployeeModel, deleteEmployeeModel};
