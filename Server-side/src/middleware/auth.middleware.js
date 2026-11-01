import { email, z } from "zod";
import jwt from 'jsonwebtoken'

export const registerSchema = z.object({
	firstname: z
		.string()
		.trim()
		.min(3, { message: "first name at least 3 characters" }),
	lastname: z
		.string()
		.trim()
		.min(3, { message: "last name at least 3 characters" }),
	email: z
		.string()
		.trim()
		.email({ message: "please provide valid email address" }),
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
});

export const validateRegister = (req, res, next) => {
	// safeParse prevents throwing runtime errors and instead returns a success flag
	const result = registerSchema.safeParse(req.body);

	if (!result.success) {
		// format errors into a clean, readable layout for your frontend
		const errorMessages = result.error.errors.map((err) => ({
			field: err.path[0],
			message: err.message,
		}));

		return res.status(400).json({
			success: false,
			errors: errorMessages,
		});
	}

	// Overwrite req.body with the sanitized/cleaned data output from Zod
	req.body = result.data;
	next();
};

export const loginSchema= z.object({
		email: z
		.string()
		.trim()
		.email({ message: "please provide valid email address" }),
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
});

export const loginValidater = (req, res, next) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      const errorMessages = result.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        errors: errorMessages,
      });
    }

    req.body = result.data;
    next();
  } catch (error) {
    console.error("Login validation error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyToken= (req, res, next)=>{
	// 1. get heaader from http authorization header
		const authHeader = req.headers.authorization;
	if(!authHeadr || !authHeader.startsWith('Bearer ')){
		return res.status(401).json({ 
			success: false,
			message: "Access denied. No token provided." 
		});
	}
	const token = authHeader.split(' ')[1];

	if (!token) {
		return res.status(401).json({
			success: false,
			message: "A Bearer token is required",
		});
	}
	try {
    // 2. Verify token using your cryptographically secure JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach the decoded user data (id, email, role) straight to the request object
    req.user = decoded;
    next(); // Pass control over to the secure controller safely
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or expired token." });
  }

}
// 2. Authorization Middleware: Limits access based on user roles
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // If protectRoute didn't run first, req.user will be undefined
    if (!req.user) {
      return res.status(500).json({ 
        success: false, 
        message: "Internal Server Error: User context missing." 
      });
    }

    // Check if the user's role is included in the allowed roles array
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your role (${req.user.role}) is not authorized to access this resource.`
      });
    }

    next(); // Role matches! Proceed to the controller
  };
};