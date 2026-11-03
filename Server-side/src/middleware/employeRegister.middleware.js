import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters"),

  lastName: z
    .string()
    .trim()
    .min(3, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters"),

  Email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(255, "Email is too long"),

  role: z.literal("employee", {
    error: "Role must be employee"
  }),

  password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" })
		// Human-readable regex steps for specific password requirements
		.regex(/[A-Z]/, {
			message: "Password must contain at least one uppercase letter",
		})
		.regex(/[a-z]/, {
			message: "Password must contain at least one lowercase letter",
		})
		.regex(/[0-9]/, { message: "Password must contain at least one number" }),

  bankAccount: z
    .string()
    .trim()
    .regex(/^\d{6,30}$/, "Bank account must contain 6-30 digits"),

  guarantorName: z
    .string()
    .trim()
    .min(3, "Guarantor name must be at least 2 characters")
    .max(100, "Guarantor name is too long"),

  guarantorPhone: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{9,15}$/, "Invalid guarantor phone number"),

  startDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Start date must use YYYY-MM-DD format"
    )
    .refine((date) => {
      const parsedDate = new Date(`${date}T00:00:00.000Z`);

      return (
        !Number.isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().slice(0, 10) === date
      );
    }, "Please provide a valid calendar date"),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9]{9,15}$/, "Invalid phone number"),

  nationalId: z
    .string()
    .trim()
    .min(3, "National ID must be at least 3 characters")
    .max(50, "National ID is too long"),

  kebeleId: z
    .string()
    .trim()
    .min(2, "Kebele ID must be at least 2 characters")
    .max(50, "Kebele ID is too long")
});

const validateEmployee = (req, res, next) => {
  // Validate incoming request body
  const result = employeeSchema.safeParse(req.body);

  // Check whether validation failed
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));

    return res.status(400).json({
      success: false,
      message: "Employee validation failed",
      errors
    });
  }

  // Replace request body with validated and cleaned data
  req.body = result.data;

  // Continue to controller
  next();
};




export const updateEmployeeSchema = z.object({
  firstName: z.string().trim().min(2).max(50).optional(),

  lastName: z.string().trim().min(2).max(50).optional(),

  Email: z.string().trim().email().max(100).optional(),

  phoneNumber: z.string().trim().min(9).max(20).optional(),

  nationalId: z.string().trim().min(3).max(50).optional(),

  kebeleId: z.string().trim().min(2).max(50).optional(),

  bankAccount: z.string().trim().min(1).max(50).optional(),

  guarantorName: z.string().trim().min(2).max(100).optional(),

  guarantorPhone: z.string().trim().min(9).max(20).optional(),

  startDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),

  status: z.enum(["active", "inactive"]).optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Provide at least one field to update"
  }
);



const validateUpdateEmployee = (req, res, next) => {
  const result = updateEmployeeSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));

    return res.status(400).json({
      success: false,
      message: "Employee validation failed",
      errors
    });
  }

  req.body = result.data;

  next();
};

export {validateUpdateEmployee, validateEmployee};

