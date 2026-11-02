import { success } from "zod";
import { getAllUserModel, updateUserModel, deleteUserModel } from "../model/manageUser.model.js";

const getAllUsersController = async (req, res) => {
	try {
		const users = await getAllUserModel();

		res.status(200).json({
			success: true,
			users,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
const updateUserController = async (req, res) => {
	try {
		// 1. Get user ID from URL parameters
		const id = Number(req.params.id);

		if (!Number.isInteger(id) || id <= 0) {
			return res.status(400).json({
				success: false,
				message: "Invalid user ID.",
			});
		}

		// 2. Get updated fields from request body
		const updateFields = { ...req.body };

		if (Object.keys(updateFields).length === 0) {
			return res.status(400).json({
				success: false,
				message: "Please provide at least one field to update.",
			});
		}

		// 3. Validate allowed request fields
		const allowedFields = [
			"firstname",
			"lastname",
			"email",
			"role",
			"password",
		];

		const invalidFields = Object.keys(updateFields).filter(
			(key) => !allowedFields.includes(key),
		);

		if (invalidFields.length > 0) {
			return res.status(400).json({
				success: false,
				message: "Invalid fields provided.",
				invalidFields,
			});
		}

		// 4. Validate role
		if (
			updateFields.role !== undefined &&
			!["customer", "employee"].includes(updateFields.role)
		) {
			return res.status(400).json({
				success: false,
				message: "Invalid user role.",
			});
		}

		// 5. Hash password if provided
		if (updateFields.password !== undefined) {
			if (
				typeof updateFields.password !== "string" ||
				updateFields.password.length < 8
			) {
				return res.status(400).json({
					success: false,
					message: "Password must contain at least 8 characters.",
				});
			}

			updateFields.password_hash = await bcrypt.hash(updateFields.password, 10);

			delete updateFields.password;
		}

		// 6. Check for valid update values
		const hasValidFields = Object.values(updateFields).some(
			(value) => value !== undefined && value !== null,
		);

		if (!hasValidFields) {
			return res.status(400).json({
				success: false,
				message: "No valid fields provided for update.",
			});
		}

		// 7. Call update model
		const result = await updateUserModel(id, updateFields);

		// 8. Check whether user exists
		if (result.affectedRows === 0) {
			return res.status(404).json({
				success: false,
				message: "User not found or no changes were made.",
			});
		}

		// 9. Return successful response
		return res.status(200).json({
			success: true,
			message: "User updated successfully.",
			data: {
				id,
				affectedRows: result.affectedRows,
			},
		});
	} catch (error) {
		console.error("Error updating user:", error);

		// Handle duplicate email
		if (error.code === "ER_DUP_ENTRY") {
			return res.status(409).json({
				success: false,
				message: "This email address is already registered.",
			});
		}

		return res.status(500).json({
			success: false,
			message: "Failed to update user.",
		});
	}
};

const deleteUserController = async (req, res) => {
  try {
    // 1. Get the ID from URL parameters
    const userId = Number(req.params.id);

    // 2. Validate the ID
    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID."
      });
    }

    // 3. Call the model
    const result = await deleteUserModel(userId);

    // 4. Check whether a user was deleted
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    // 5. Send success response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully."
    });

  } catch (error) {
    // Log the actual error on the backend
    console.error("Delete user controller error:", error);

    // Send a safe response to the frontend
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while deleting the user."
    });
  }
};




export { getAllUsersController, updateUserController, deleteUserController };
