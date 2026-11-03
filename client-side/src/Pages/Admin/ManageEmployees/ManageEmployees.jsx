import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  FaUserTie,
  FaUserCheck,
  FaUserSlash,
  FaMagnifyingGlass,
  FaUserPlus,
  FaEnvelope,
  FaPhone,
  FaTrashCan,
  FaPenToSquare,
  FaXmark,
  FaTriangleExclamation,
  FaBuilding,
  FaCalendarDays,
  FaCreditCard,
  FaRotate,
} from "react-icons/fa6";
import { getAuth } from "../../../utils/Auth";

// Change this if your Express API uses a different host or port.
// You can move it to VITE_API_BASE_URL in your .env file.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const employeesApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const emptyForm = {
  firstName: "",
  lastName: "",
  Email: "",
  password: "",
  phoneNumber: "",
  nationalId: "",
  kebeleId: "",
  bankAccount: "",
  guarantorName: "",
  guarantorPhone: "",
  startDate: "",
  status: "active",
};

const getErrorMessage = (error) => {
  const response = error?.response?.data;

  if (Array.isArray(response?.errors)) {
    return response.errors.map((item) => item.message).join(" ");
  }

  return (
    response?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
};

const formatDate = (value) => {
  if (!value) return "Not provided";
  // Avoid timezone shifting for SQL DATE values such as YYYY-MM-DD.
  const datePart = String(value).slice(0, 10);
  const date = new Date(`${datePart}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? datePart
    : new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
};

const getEmployeeName = (employee) =>
  `${employee.firstName || ""} ${employee.lastName || ""}`.trim() ||
  "Unnamed employee";

const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  helpText,
  minLength,
  autoComplete,
}) => (
  <div className="space-y-1.5">
    <label htmlFor={name} className="block text-sm font-semibold text-slate-700">
      {label}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      autoComplete={autoComplete}
      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
    />
    {helpText && <p className="text-xs text-slate-500">{helpText}</p>}
  </div>
);

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const isEditing = Boolean(selectedEmployee);

  // get the token from getAuth
  const auth = getAuth()
console.log(auth.token);

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setPageError("");

    try {
      const response = await employeesApi.get("/manage-employee/employees",{
        headers:{
          Authorization:`Bearer ${auth.token}`
        }
      });
      const list = response.data?.data;

      if (!Array.isArray(list)) {
        throw new Error("The employees API did not return an employee list.");
      }

      setEmployees(list);
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return employees;

    return employees.filter((employee) => {
      const searchableValues = [
        employee.userId,
        employee.employeeId,
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.phoneNumber,
        employee.nationalId,
        employee.kebeleId,
        employee.status,
      ];

      return searchableValues.some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );
    });
  }, [employees, searchQuery]);

  const activeCount = employees.filter(
    (employee) => employee.status === "active"
  ).length;

  const inactiveCount = employees.filter(
    (employee) => employee.status === "inactive"
  ).length;

  const openAddModal = () => {
    setSelectedEmployee(null);
    setFormData({ ...emptyForm });
    setNotice("");
    setPageError("");
    setIsFormOpen(true);
  };

  const openEditModal = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      ...emptyForm,
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      Email: employee.email || "",
      phoneNumber: employee.phoneNumber || "",
      nationalId: employee.nationalId || "",
      kebeleId: employee.kebeleId || "",
      bankAccount: employee.bankAccount || "",
      guarantorName: employee.guarantorName || "",
      guarantorPhone: employee.guarantorPhone || "",
      startDate: employee.startDate
        ? String(employee.startDate).slice(0, 10)
        : "",
      status: employee.status || "active",
    });
    setNotice("");
    setPageError("");
    setIsFormOpen(true);
  };

  const closeFormModal = () => {
    if (isSaving) return;
    setIsFormOpen(false);
    setSelectedEmployee(null);
    setFormData({ ...emptyForm });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setPageError("");
    setNotice("");

    try {
      if (isEditing) {
        // PATCH sends only changed fields. This keeps the request minimal.
        const editableFields = [
          "firstName",
          "lastName",
          "Email",
          "phoneNumber",
          "nationalId",
          "kebeleId",
          "bankAccount",
          "guarantorName",
          "guarantorPhone",
          "startDate",
          "status",
        ];

        const originalValues = {
          firstName: selectedEmployee.firstName || "",
          lastName: selectedEmployee.lastName || "",
          Email: selectedEmployee.email || "",
          phoneNumber: selectedEmployee.phoneNumber || "",
          nationalId: selectedEmployee.nationalId || "",
          kebeleId: selectedEmployee.kebeleId || "",
          bankAccount: selectedEmployee.bankAccount || "",
          guarantorName: selectedEmployee.guarantorName || "",
          guarantorPhone: selectedEmployee.guarantorPhone || "",
          startDate: selectedEmployee.startDate
            ? String(selectedEmployee.startDate).slice(0, 10)
            : "",
          status: selectedEmployee.status || "active",
        };

        const patchData = {};

        editableFields.forEach((field) => {
          if (formData[field] !== originalValues[field]) {
            patchData[field] = formData[field];
          }
        });

        if (Object.keys(patchData).length === 0) {
          setNotice("No changes were made.");
          setIsFormOpen(false);
          setSelectedEmployee(null);
          return;
        }

        const response = await employeesApi.patch(
          `/manage-employee/employees/${selectedEmployee.userId}`,
          patchData,{
        headers:{
          Authorization:`Bearer ${auth.token}`
        }
      }
        );

        const updatedEmployee = response.data?.data;

        if (!updatedEmployee) {
          throw new Error("The API did not return the updated employee.");
        }

        // The backend returns the complete employee record.
        setEmployees((previous) =>
          previous.map((employee) =>
            employee.userId === selectedEmployee.userId
              ? updatedEmployee
              : employee
          )
        );

        setNotice("Employee updated successfully.");
      } else {
        const registrationData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          Email: formData.Email,
          role: "employee",
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          nationalId: formData.nationalId,
          kebeleId: formData.kebeleId,
          bankAccount: formData.bankAccount,
          guarantorName: formData.guarantorName,
          guarantorPhone: formData.guarantorPhone,
          startDate: formData.startDate,
        };

        await employeesApi.post("/manage-employee/register", registrationData,{
          headers:{
            Authorization:`Bearer ${auth.token}`
          }
        });

        // Fetch the canonical database record so IDs and dates match the API.
        await fetchEmployees();
        setNotice("Employee registered successfully.");
      }

      setIsFormOpen(false);
      setSelectedEmployee(null);
      setFormData({ ...emptyForm });
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (employee) => {
    setSelectedEmployee(employee);
    setPageError("");
    setIsDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setIsDeleteOpen(false);
    setSelectedEmployee(null);
  };

  const handleDelete = async () => {
    if (!selectedEmployee) return;

    setIsDeleting(true);
    setPageError("");

    try {
      // Requires DELETE /api/employees/:userId on the Express backend.
      await employeesApi.delete(`/manage-employee/employees/${selectedEmployee.userId}`,{
        headers:{
          Authorization:`Bearer ${auth.token}`
        }
      });

      setEmployees((previous) =>
        previous.filter(
          (employee) => employee.userId !== selectedEmployee.userId
        )
      );

      setIsDeleteOpen(false);
      setSelectedEmployee(null);
      setNotice("Employee deleted successfully.");
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative space-y-6 pb-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
            Workforce
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Manage employees
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View employee records and manage their account information.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20"
        >
          <FaUserPlus />
          Add employee
        </button>
      </div>

      {/* Feedback messages */}
      {pageError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <FaTriangleExclamation className="mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">{pageError}</div>
          <button
            type="button"
            onClick={() => setPageError("")}
            aria-label="Dismiss error"
            className="rounded p-1 hover:bg-rose-100"
          >
            <FaXmark />
          </button>
        </div>
      )}

      {notice && !pageError && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          <span>{notice}</span>
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
            className="rounded p-1 hover:bg-emerald-100"
          >
            <FaXmark />
          </button>
        </div>
      )}

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total employees
              </p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {employees.length}
              </p>
            </div>
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FaUserTie className="text-xl" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Active employees
              </p>
              <p className="mt-2 text-3xl font-extrabold text-emerald-600">
                {activeCount}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <FaUserCheck className="text-xl" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Inactive employees
              </p>
              <p className="mt-2 text-3xl font-extrabold text-amber-600">
                {inactiveCount}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <FaUserSlash className="text-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Search and refresh */}
      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <FaMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search name, email, phone or ID..."
            aria-label="Search employees"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />
        </div>

        <button
          type="button"
          onClick={fetchEmployees}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaRotate className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </section>

      {/* Employee list */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <FaRotate className="mx-auto animate-spin text-2xl text-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            Loading employees...
          </p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <FaUserTie className="text-xl" />
          </div>
          <h2 className="mt-4 font-bold text-slate-800">
            {employees.length === 0
              ? "No employees registered yet"
              : "No matching employees"}
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            {employees.length === 0
              ? "Add your first employee to start building your team directory."
              : "Try another name, email address, phone number or employee ID."}
          </p>
          {employees.length === 0 && (
            <button
              type="button"
              onClick={openAddModal}
              className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Add your first employee
            </button>
          )}
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredEmployees.map((employee) => {
            const fullName = getEmployeeName(employee);
            const isActive = employee.status === "active";

            return (
              <article
                key={employee.userId}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-bold text-indigo-700">
                        {(employee.firstName?.[0] || "E").toUpperCase()}
                        {(employee.lastName?.[0] || "").toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-bold text-slate-900">
                          {fullName}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Employee ID: {employee.employeeId ?? "—"} · User ID:{" "}
                          {employee.userId}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex min-w-0 items-center gap-2.5 text-sm text-slate-600">
                      <FaEnvelope className="shrink-0 text-slate-400" />
                      <span className="truncate">{employee.email || "No email"}</span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2.5 text-sm text-slate-600">
                      <FaPhone className="shrink-0 text-slate-400" />
                      <span className="truncate">
                        {employee.phoneNumber || "No phone"}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2.5 text-sm text-slate-600">
                      <FaCreditCard className="shrink-0 text-slate-400" />
                      <span className="truncate">
                        {employee.bankAccount || "No bank account"}
                      </span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2.5 text-sm text-slate-600">
                      <FaCalendarDays className="shrink-0 text-slate-400" />
                      <span>Started {formatDate(employee.startDate)}</span>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        National ID
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                        {employee.nationalId || "—"}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        Guarantor
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-slate-700">
                        {employee.guarantorName || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-5 py-3 sm:px-6">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                    <FaBuilding className="text-slate-400" />
                    Employee account
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(employee)}
                      title="Edit employee"
                      aria-label={`Edit ${fullName}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-indigo-600"
                    >
                      <FaPenToSquare />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(employee)}
                      title="Delete employee"
                      aria-label={`Delete ${fullName}`}
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-rose-600"
                    >
                      <FaTrashCan />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Add / edit employee modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeFormModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="employee-form-title"
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2
                  id="employee-form-title"
                  className="text-lg font-bold text-slate-900"
                >
                  {isEditing ? "Edit employee" : "Add new employee"}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {isEditing
                    ? "Change the fields you need. Only changed fields will be sent."
                    : "Enter the employee account and employment information."}
                </p>
              </div>
              <button
                type="button"
                onClick={closeFormModal}
                disabled={isSaving}
                aria-label="Close form"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <FaXmark />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto">
              <div className="space-y-6 px-5 py-5 sm:px-6">
                <div>
                  <h3 className="mb-3 text-sm font-bold text-slate-800">
                    Personal information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="First name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      required
                      minLength={2}
                      autoComplete="given-name"
                    />
                    <Field
                      label="Last name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      required
                      minLength={2}
                      autoComplete="family-name"
                    />
                    <Field
                      label="Email address"
                      name="Email"
                      type="email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      placeholder="employee@example.com"
                      required
                      autoComplete="email"
                    />
                    <Field
                      label="Phone number"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="0912345678"
                      required
                      autoComplete="tel"
                    />
                    {!isEditing && (
                      <Field
                        label="Temporary password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="At least 8 characters"
                        required
                        minLength={8}
                        autoComplete="new-password"
                        helpText="The backend hashes this password before saving it."
                      />
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h3 className="mb-3 text-sm font-bold text-slate-800">
                    Identification
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="National ID"
                      name="nationalId"
                      value={formData.nationalId}
                      onChange={handleInputChange}
                      placeholder="Enter national ID"
                      required
                    />
                    <Field
                      label="Kebele ID"
                      name="kebeleId"
                      value={formData.kebeleId}
                      onChange={handleInputChange}
                      placeholder="Enter kebele ID"
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <h3 className="mb-3 text-sm font-bold text-slate-800">
                    Employment and guarantor information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field
                      label="Bank account"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleInputChange}
                      placeholder="Enter bank account"
                      required
                    />
                    <Field
                      label="Start date"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                    <Field
                      label="Guarantor name"
                      name="guarantorName"
                      value={formData.guarantorName}
                      onChange={handleInputChange}
                      placeholder="Enter guarantor name"
                      required
                    />
                    <Field
                      label="Guarantor phone"
                      name="guarantorPhone"
                      type="tel"
                      value={formData.guarantorPhone}
                      onChange={handleInputChange}
                      placeholder="Enter guarantor phone"
                      required
                    />

                    {isEditing && (
                      <div className="space-y-1.5">
                        <label
                          htmlFor="status"
                          className="block text-sm font-semibold text-slate-700"
                        >
                          Employee status
                        </label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={closeFormModal}
                  disabled={isSaving}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSaving && <FaRotate className="animate-spin" />}
                  {isSaving
                    ? "Saving..."
                    : isEditing
                      ? "Save changes"
                      : "Create employee"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* Delete confirmation */}
      {isDeleteOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <FaTriangleExclamation className="text-lg" />
            </div>
            <h2 id="delete-title" className="mt-4 text-lg font-bold text-slate-900">
              Delete employee?
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              You are about to delete{" "}
              <strong>{getEmployeeName(selectedEmployee)}</strong>. This action
              may permanently remove the employee account and related records.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {isDeleting && <FaRotate className="animate-spin" />}
                {isDeleting ? "Deleting..." : "Delete employee"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ManageEmployees;
