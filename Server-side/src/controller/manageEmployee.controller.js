import { registerEmployeeModel, getAllEmployeesModel, updateEmployeeModel, deleteEmployeeModel } from "../model/manageEmployee.model.js";
import bcrypt from "bcryptjs";

const registerEmployeeController = async (req, res, next) => {
	try {
		// 1. Get validated employee data from Zod middleware
		const {
			firstName,
			lastName,
			Email,
			role,
			password,
			bankAccount,
			guarantorName,
			guarantorPhone,
			startDate,
			phoneNumber,
			nationalId,
			kebeleId,
		} = req.body;

		// 2. Hash employee password before saving
		const saltRounds = 12;
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		// 3. Prepare employee data for database model
		const employeeData = {
			firstName,
			lastName,
			Email,
			role,
			password: hashedPassword,
			bankAccount,
			guarantorName,
			guarantorPhone,
			startDate,
			phoneNumber,
			nationalId,
			kebeleId,
		};

		// 4. Call model to register employee in MySQL
		const response = await registerEmployeeModel(employeeData);

		// 5. Return successful response
		return res.status(201).json({
			success: true,
			message: "Employee registered successfully",
			data: response,
		});
	} catch (error) {
		// 6. Pass unexpected errors to global error handler
		next(error);
	}
};
const getAllEmployeesController = async (req, res, next) => {
  try {
    // 1. Get all employees from database
    const employees = await getAllEmployeesModel();

    // 2. Check whether employees exist
    if (employees.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No employees found",
        totalEmployees: 0,
        data: []
      });
    }

    // 3. Return employee information
    return res.status(200).json({
      success: true,
      message: "Employees retrieved successfully",
      totalEmployees: employees.length,
      data: employees
    });

  } catch (error) {
    // 4. Forward unexpected errors to global error handler
    next(error);
  }
};



const updateEmployeeController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID"
      });
    }

    const updatedEmployee = await updateEmployeeModel(
      userId,
      req.body
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: updatedEmployee
    });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered."
      });
    }

    next(error);
  }
};


const deleteEmployeeController = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid employee ID"
      });
    }

    const deletedEmployee = await deleteEmployeeModel(userId);

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee and related records deleted successfully",
      data: deletedEmployee
    });

  } catch (error) {
    next(error);
  }
};


export { registerEmployeeController, getAllEmployeesController,updateEmployeeController, deleteEmployeeController  };
