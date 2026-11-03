import express from 'express';
import { registerEmployeeController, getAllEmployeesController, updateEmployeeController, deleteEmployeeController } from '../controller/manageEmployee.controller.js';
import { validateEmployee, validateUpdateEmployee} from '../middleware/employeRegister.middleware.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';

const employeeRoute = express.Router();

employeeRoute.post('/manage-employee/register',validateEmployee,verifyToken,authorizeRoles("admin"), registerEmployeeController);
employeeRoute.get('/manage-employee/employees',verifyToken,authorizeRoles("admin"), getAllEmployeesController);
employeeRoute.patch('/manage-employee/employees/:userId',verifyToken,authorizeRoles("admin"),validateUpdateEmployee, updateEmployeeController)
employeeRoute.delete('/manage-employee/employees/:userId',verifyToken,authorizeRoles("admin"), deleteEmployeeController)

export { employeeRoute};