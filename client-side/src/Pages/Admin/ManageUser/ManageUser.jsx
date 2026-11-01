import React, { useState, useEffect } from "react";
import {
	FaUsers,
	FaUserCheck,
	FaUserXmark,
	FaMagnifyingGlass,
	FaUserPlus,
	FaUserPen,
	FaTrashCan,
	FaEllipsisVertical,
} from "react-icons/fa6";
import axios from "axios";

const ManageUser = () => {
	const [users, setUsers] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(
					"http://localhost:5000/api/manage-users/users",
				);

				// DEBUG: Check what your API is actually returning in the console
				console.log("API Response:", response.data);

				// Adjust this depending on your backend structure:
				// If response.data is the array directly: setUsers(response.data);
				// If response.data is an object containing the array (e.g. response.data.users):
				setUsers(
					Array.isArray(response.data)
						? response.data
						: response.data.users || [],
				);
			} catch (error) {
				console.error("Failed to fetch users:", error);
				setUsers([]); // Fallback to an empty array on error so .filter() never breaks
			}
		};

		fetchUsers();
	}, []);

	// Safeguard: Ensure 'users' is always treated as an array before filtering
	const safeUsers = Array.isArray(users) ? users : [];

	const filteredUsers = safeUsers.filter(
		(user) =>
			(user.name &&
				user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
			(user.email &&
				user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
			(user.id && user.id.toLowerCase().includes(searchQuery.toLowerCase())),
	);

	const totalUsers = safeUsers.length;
	const activeCount = safeUsers.filter((u) => u.status === "active").length;
	const suspendedCount = safeUsers.filter(
		(u) => u.status === "suspended",
	).length;

	return (
		<div className="space-y-8 animate-fade-in">
			{/* SECTION 1: USER SUMMARY MANAGEMENT KPI CARDS */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

			{/* SECTION 2: DATATABLE CONTAINER CONTROLS & HOOD */}
			<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
				{/* Table Filter Top Toolbar Controls Area */}
				<div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
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

					<button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-indigo-500/25 transition-all duration-200 cursor-pointer">
						<FaUserPlus /> Add New User
					</button>
				</div>

				{/* The Core Enterprise Responsive Grid Data Table View */}
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-xs font-bold uppercase tracking-wider">
								<th className="py-4 px-6">Id</th>
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
										{/* User Identity cell */}
										<td className="py-4 px-6">
											<div className="flex flex-col">
												<span className="font-bold text-slate-800">
													{user.id}
												</span>
											</div>
										</td>

										{/* Account ID cell */}
										<td className="py-4 px-6">
											<span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
												{user.firstname}
											</span>
											<span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
												{user.lastname}
											</span>
										</td>
										<td className="py-4 px-6">
											<span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
												{user.email}
											</span>
										</td>

										{/* Role Badges Cell mapping */}
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

										{/* Status Tags cell conditional routing */}
										<td className="py-4 px-6">
											<span className="inline-flex items-center gap-1.5 text-xs font-bold capitalize  text-black">
												{/* Format the date string */}
												{user.created_at
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
							
										

										{/* Action Panel Utilities */}
										<td className="py-4 px-6 text-center">
											<div className="flex items-center justify-center gap-2">
												<button
													className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
													title="Edit Profile Details"
												>
													<FaUserPen className="w-3.5 h-3.5" />
												</button>
												<button
													className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
													title="Terminate Account"
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
										No matching user records could be found in the current
										system state view.
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
