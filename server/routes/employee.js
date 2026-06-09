import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addEmployee, upload, getEmployees, getEmployee, updateEmployee } from "../controllers/employeeController.js";
import { getDepartments, editDepartemnt, updateDepartment, deleteDepartment } from "../controllers/departmentController.js";

const router = express.Router();

router.get("/", authMiddleware , getEmployees);
// router.get("/", authMiddleware , getDepartments);
router.post("/add", authMiddleware ,upload.single('profileImage'),addEmployee);
router.get("/:id", authMiddleware , getEmployee);
router.put("/:id", authMiddleware , upload.single('profileImage'), updateEmployee);
// router.delete("/:id", authMiddleware , deleteDepartment);


export default router;