import React, { useState, useEffect } from "react";

import {
	FaUsers,
	FaUserCheck,
	FaUserXmark,
	FaMagnifyingGlass,
	FaUserPlus,
	FaUserPen,
	FaTrashCan,
	FaXmark,
} from "react-icons/fa6";
// import the token provider called getAuth
import { getAuth } from "../../../utils/Auth";
import axios from "axios";

const API_URL = "http://localhost:5000/api/manage-users";

const ManageUser = () => {
	// ==========================================
	// 1. REACT STATES
	// ==========================================

	const [users, setUsers] = useState([]);

	const [searchQuery, setSearchQuery] = useState("");

	// Add user modal
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Delete modal
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [userToDelete, setUserToDelete] = useState(null);

	// Edit modal
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [userToEdit, setUserToEdit] = useState(null);

	// Loading states
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	// Form data
	const initialFormData = {
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		role: "customer",
	};

	const [formData, setFormData] = useState(initialFormData);

	// ==========================================
	// 2. FETCH USERS FROM DATABASE
	// ==========================================
	const auth = getAuth();

	const fetchUsers = async () => {
		try {
			const response = await axios.get(`${API_URL}/users`,{
        headers:{
          Authorization:`Bearer ${auth.token}`
        }
      });

			console.log("API Response:", response.data);

			const fetchedUsers = Array.isArray(response.data)
				? response.data
				: Array.isArray(response.data?.users)
					? response.data.users
					: [];

			setUsers(fetchedUsers);
		} catch (error) {
			console.error(
				"Failed to fetch users:",
				error.response?.data || error.message,
			);

			throw error;
		}
	};

	// Fetch users when component mounts
	useEffect(() => {
		fetchUsers().catch(() => {
			setUsers([]);
		});
	}, []);

	// ==========================================
	// 3. FORM HANDLING
	// ==========================================

	// Handle input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;

		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	// Reset form data
	const resetForm = () => {
		setFormData(initialFormData);
	};

	// ==========================================
	// 4. REGISTER NEW USER
	// ==========================================

	const handleCreateUser = async (e) => {
		e.preventDefault();

		if (isSubmitting) return;

		try {
			setIsSubmitting(true);

			await axios.post(`${API_URL}/register`, formData,{
        headers:{
          Authorization:`Bearer ${auth.token}`
        }
      });

			alert("User registered successfully!");

			await fetchUsers();

			resetForm();

			setIsModalOpen(false);
		} catch (error) {
			console.error(
				"Failed to create user:",
				error.response?.data || error.message,
			);

			alert(error.response?.data?.message || "Failed to register user.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// ==========================================
	// 5. OPEN EDIT MODAL
	// ==========================================

	const confirmEdit = (user) => {
		// Store selected user's ID
		setUserToEdit(user.id);

		// Populate form with existing user information
		setFormData({
			firstname: user.firstname || "",
			lastname: user.lastname || "",
			email: user.email || "",
			password: "",
			role: user.role || "customer",
		});

		// Close add modal if necessary
		setIsModalOpen(false);

		// Open edit modal
		setEditModalOpen(true);
	};

	// ==========================================
	// 6. UPDATE EXISTING USER
	// ==========================================

	const handleUpdateUser = async (e) => {
		e.preventDefault();

		if (userToEdit === null || isSubmitting) return;

		try {
			setIsSubmitting(true);

			// Prepare update data
			const updateData = {
				firstname: formData.firstname,
				lastname: formData.lastname,
				email: formData.email,
				role: formData.role,
			};

			// Only include password when the user entered a new one
			if (formData.password.trim() !== "") {
				updateData.password = formData.password;
			}

			// Send PUT request to Express backend
			const response = await axios.patch(
				`${API_URL}/${userToEdit}`,
				updateData,{
        headers:{
          Authorization:`Bearer ${auth.token}`
        }
      }
			);

			console.log("Update response:", response.data);

			alert("User updated successfully!");

			// Refresh users table
			await fetchUsers();

			// Close edit modal
			setEditModalOpen(false);

			// Reset selected user
			setUserToEdit(null);

			resetForm();
		} catch (error) {
			console.error(
				"Failed to update user:",
				error.response?.data || error.message,
			);

			alert(error.response?.data?.message || "Failed to update user.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// ==========================================
	// 7. OPEN DELETE CONFIRMATION MODAL
	// ==========================================

	const confirmDelete = (userId) => {
		setUserToDelete(userId);

		setDeleteModalOpen(true);
	};

	// ==========================================
	// 8. DELETE USER FROM DATABASE
	// ==========================================

	const handleDeleteConfirmed = async () => {
		if (userToDelete === null || isDeleting) return;

		try {
			setIsDeleting(true);

			// Send DELETE request to Express backend
			const response = await axios.delete(`${API_URL}/${userToDelete}`,{
        headers:{
          Authorization:`Bearer ${auth.token}`
        }
      });

			console.log("Delete response:", response.data);

			alert("User deleted successfully!");

			// Refresh users table
			await fetchUsers();

			// Close delete modal
			setDeleteModalOpen(false);

			// Reset selected user
			setUserToDelete(null);
		} catch (error) {
			console.error(
				"Failed to delete user:",
				error.response?.data || error.message,
			);

			alert(error.response?.data?.message || "Failed to delete user.");
		} finally {
			setIsDeleting(false);
		}
	};

	// ==========================================
	// 9. CLOSE MODALS
	// ==========================================

	const closeAddModal = () => {
		setIsModalOpen(false);

		resetForm();
	};

	const closeEditModal = () => {
		setEditModalOpen(false);

		setUserToEdit(null);

		resetForm();
	};

	const closeDeleteModal = () => {
		setDeleteModalOpen(false);

		setUserToDelete(null);
	};

	// ==========================================
	// 10. SEARCH AND FILTER USERS
	// ==========================================

	const safeUsers = Array.isArray(users) ? users : [];

	const filteredUsers = safeUsers.filter((user) => {
		const search = searchQuery.toLowerCase().trim();

		return (
			String(user.firstname || "")
				.toLowerCase()
				.includes(search) ||
			String(user.lastname || "")
				.toLowerCase()
				.includes(search) ||
			String(user.email || "")
				.toLowerCase()
				.includes(search) ||
			String(user.id || "")
				.toLowerCase()
				.includes(search)
		);
	});

	// ==========================================
	// 11. USER SUMMARY COUNTS
	// ==========================================

	const totalUsers = safeUsers.length;

	const activeCount = safeUsers.filter(
		(user) => user.status === "active",
	).length;

	const suspendedCount = safeUsers.filter(
		(user) => user.status === "suspended",
	).length;

	// ==========================================
	// 12. REUSABLE USER FORM
	// ==========================================

	const renderUserForm = (isEditing = false) => (
		<form
			onSubmit={isEditing ? handleUpdateUser : handleCreateUser}
			className="p-6 space-y-4"
		>
			{/* First Name */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					First Name
				</label>

				<input
					type="text"
					name="firstname"
					required
					value={formData.firstname}
					onChange={handleInputChange}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
					placeholder="Enter first name"
				/>
			</div>

			{/* Last Name */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Last Name
				</label>

				<input
					type="text"
					name="lastname"
					required
					value={formData.lastname}
					onChange={handleInputChange}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
					placeholder="Enter last name"
				/>
			</div>

			{/* Email */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Email Address
				</label>

				<input
					type="email"
					name="email"
					required
					value={formData.email}
					onChange={handleInputChange}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
					placeholder="Enter email address"
				/>
			</div>

			{/* Password */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					{isEditing ? "New Password (Optional)" : "Password"}
				</label>

				<input
					type="password"
					name="password"
					required={!isEditing}
					value={formData.password}
					onChange={handleInputChange}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
					placeholder={
						isEditing
							? "Leave empty to keep current password"
							: "Enter password"
					}
				/>
			</div>

			{/* Role */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Role
				</label>

				<select
					name="role"
					value={formData.role}
					onChange={handleInputChange}
					className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
				>
					<option value="customer">Customer</option>

					<option value="employee">Employee</option>
				</select>
			</div>

			{/* Form Buttons */}
			<div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
				<button
					type="button"
					onClick={isEditing ? closeEditModal : closeAddModal}
					disabled={isSubmitting}
					className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
				>
					Cancel
				</button>

				<button
					type="submit"
					disabled={isSubmitting}
					className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow transition-all cursor-pointer disabled:opacity-50"
				>
					{isSubmitting
						? "Processing..."
						: isEditing
							? "Update User"
							: "Save User"}
				</button>
			</div>
		</form>
	);

	// ==========================================
	// 13. COMPONENT UI
	// ==========================================

	return (
		<div className="space-y-8 animate-fade-in">
			{/* ==================================
                SECTION 1: SUMMARY CARDS
            ================================== */}

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Total Users */}
				<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
					<div className="space-y-1">
						<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Total System Users
						</span>

						<h3 className="text-2xl font-extrabold text-slate-800">
							{totalUsers} Accounts
						</h3>
					</div>

					<div className="p-3.5 rounded-xl bg-indigo-50 text-indigo-600 text-lg shadow-sm border border-indigo-100">
						<FaUsers />
					</div>
				</div>

				{/* Active Users */}
				<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
					<div className="space-y-1">
						<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Active Status
						</span>

						<h3 className="text-2xl font-extrabold text-emerald-600">
							{activeCount} Verified
						</h3>
					</div>

					<div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 text-lg shadow-sm border border-emerald-100">
						<FaUserCheck />
					</div>
				</div>

				{/* Suspended Users */}
				<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
					<div className="space-y-1">
						<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Suspended Actions
						</span>

						<h3 className="text-2xl font-extrabold text-rose-600">
							{suspendedCount} Flagged
						</h3>
					</div>

					<div className="p-3.5 rounded-xl bg-rose-50 text-rose-600 text-lg shadow-sm border border-rose-100">
						<FaUserXmark />
					</div>
				</div>
			</div>

			{/* ==================================
                SECTION 2: USER MANAGEMENT TABLE
            ================================== */}

			<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
				{/* Toolbar */}
				<div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
					{/* Search */}
					<div className="relative w-full sm:w-80 flex items-center">
						<FaMagnifyingGlass className="absolute left-3.5 text-slate-400 w-4 h-4" />

						<input
							type="text"
							placeholder="Search user profile, email, ID..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 shadow-sm transition-all"
						/>
					</div>

					{/* Add User Button */}
					<button
						onClick={() => {
							resetForm();
							setIsModalOpen(true);
						}}
						className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-indigo-500/25 transition-all duration-200 cursor-pointer"
					>
						<FaUserPlus />
						Add New User
					</button>
				</div>

				{/* ==================================
                    SECTION 3: ADD USER MODAL
                ================================== */}

				{isModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
						<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
							<div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
								<h3 className="text-lg font-bold text-gray-800">
									Add New User
								</h3>

								<button
									type="button"
									onClick={closeAddModal}
									disabled={isSubmitting}
									className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
								>
									<FaXmark size={18} />
								</button>
							</div>

							{renderUserForm(false)}
						</div>
					</div>
				)}

				{/* ==================================
                    SECTION 4: EDIT USER MODAL
                ================================== */}

				{editModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
						<div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
							<div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
								<div>
									<h3 className="text-lg font-bold text-gray-800">Edit User</h3>

									<p className="text-xs text-gray-500 mt-1">
										User ID: {userToEdit}
									</p>
								</div>

								<button
									type="button"
									onClick={closeEditModal}
									disabled={isSubmitting}
									className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
								>
									<FaXmark size={18} />
								</button>
							</div>

							{renderUserForm(true)}
						</div>
					</div>
				)}

				{/* ==================================
                    SECTION 5: DELETE CONFIRMATION MODAL
                ================================== */}

				{deleteModalOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
						<div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200 text-center p-6">
							<div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl">
								<FaTrashCan />
							</div>

							<h3 className="text-lg font-bold text-slate-800 mb-1">
								Delete Account
							</h3>

							<p className="text-sm text-slate-500 mb-6">
								Are you sure you want to delete this user? This action cannot be
								undone.
							</p>

							<div className="flex justify-center gap-3">
								<button
									type="button"
									onClick={closeDeleteModal}
									disabled={isDeleting}
									className="w-full px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
								>
									Cancel
								</button>

								<button
									type="button"
									onClick={handleDeleteConfirmed}
									disabled={isDeleting}
									className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
								>
									{isDeleting ? "Deleting..." : "Yes, Delete"}
								</button>
							</div>
						</div>
					</div>
				)}

				{/* ==================================
                    SECTION 6: USERS DATA TABLE
                ================================== */}

				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
								<th className="py-4 px-6">ID</th>

								<th className="py-4 px-6">User Name</th>

								<th className="py-4 px-6">Email</th>

								<th className="py-4 px-6">Role</th>

								<th className="py-4 px-6">Date Registered</th>

								<th className="py-4 px-6 text-center">Actions</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
							{filteredUsers.length > 0 ? (
								filteredUsers.map((user) => (
									<tr
										key={user.id}
										className="hover:bg-slate-50/70 transition-colors"
									>
										{/* User ID */}
										<td className="py-4 px-6">
											<span className="font-bold text-slate-800">
												{user.id}
											</span>
										</td>

										{/* User Name */}
										<td className="py-4 px-6">
											<span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
												{user.firstname}
											</span>

											<span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md ml-1">
												{user.lastname}
											</span>
										</td>

										{/* Email */}
										<td className="py-4 px-6">
											<span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
												{user.email}
											</span>
										</td>

										{/* Role */}
										<td className="py-4 px-6">
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
													user.role === "employee"
														? "bg-blue-50 text-blue-700 border border-blue-100"
														: "bg-indigo-50 text-indigo-700 border border-indigo-100"
												}`}
											>
												{user.role}
											</span>
										</td>

										{/* Registration Date */}
										<td className="py-4 px-6">
											<span className="inline-flex items-center gap-1.5 text-xs font-bold capitalize text-black">
												{user.created_at &&
												!Number.isNaN(new Date(user.created_at).getTime())
													? new Date(user.created_at).toLocaleDateString(
															"en-US",
															{
																year: "numeric",
																month: "short",
																day: "numeric",
															},
														)
													: "N/A"}
											</span>
										</td>

										{/* Action Buttons */}
										<td className="py-4 px-6 text-center">
											<div className="flex items-center justify-center gap-2">
												{/* Edit Button */}
												<button
													type="button"
													onClick={() => confirmEdit(user)}
													className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
													title="Edit Profile Details"
												>
													<FaUserPen className="w-3.5 h-3.5" />
												</button>

												{/* Delete Button */}
												<button
													type="button"
													onClick={() => confirmDelete(user.id)}
													className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
													title="Delete Account"
												>
													<FaTrashCan className="w-3.5 h-3.5" />
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan="6"
										className="py-12 text-center text-slate-400 font-semibold bg-slate-50/30"
									>
										No matching user records could be found.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default ManageUser;
