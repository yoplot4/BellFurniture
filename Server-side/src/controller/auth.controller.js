import { date, success } from "zod";
import {registerModel, loginModel}  from "../model/auth.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



const registerController= async (req, res)=>{
  const {firstname, lastname, email, password }= req.body;
  // assign salt to use hash the password
  const salt= await bcrypt.genSalt(10);
  const hashPassword= await bcrypt.hash(password, salt);
  //
  try {
    const result = await registerModel(firstname, lastname, email, hashPassword);

    return res.status(201).json({
      success:true,
      message:'User registered succefully',
      userId: result.userId
    })
  }catch (error) {
    console.error("Critical error in registerController:", error);
    
    // Handle database duplicates (e.g., if the email is already taken)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: "This email address is already registered."
      });
    }

    // Fallback error for other issues
    return res.status(500).json({
      success: false,
      message: "Internal server error during registration."
    });
  }
  
}
const loginController= async (req, res)=>{
  const { email, password}= req.body;
  try {
    const user= await loginModel(email);
    
    if(!user){
      return res.status(401).json({
        success:false,
        message:'Invalid password or email'
      })
    }
    const storedPassword = user.password;

    const isMatch = await bcrypt.compare(password, storedPassword);
    if (!isMatch) {
      return res.status(401).json({
        success:false,
        message:'Invalid password or email'
      })
    }

    const payLoad= {
      id: user.id,
      email: user.email,
      role: user.role
    }

    const token = jwt.sign(
      payLoad,
      process.env.JWT_SECRETE,
      {
        expiresIn:'12h'
      }
    )
    
     // 4. Strip the password out of the user object before sending it back
    const { password: _, ...safeUserData } = user;

    return res.status(200).json({
      success: true,
      token:token,
      message: 'login Succesfull',
      data: safeUserData
    })
  } catch (error) {
    console.log(error);
  }
}

export { registerController, loginController };