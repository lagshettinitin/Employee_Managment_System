import Employee from "../modules/Employee.js";
import User from "../modules/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import multer from "multer"; // 

const storage = multer.diskStorage({
    // this will specify the destination folder where the uploaded files will be stored and the filename function will specify how the uploaded files will be named 
    destination: function (req, file, cb) {
        cb(null, "public/uploads")
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname)) // this will give the file a unique name by appending the current timestamp to the original file name
    }
})

const upload = multer({storage: storage}); // this will create a multer instance with the defined storage configuration

const addEmployee = async (req, res)=>{
    try{
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        
        const {name, 
           email,
           password,
           role,
           employeeId,
           dob, 
           gender,
           maritalStatus,
           designation,
           department, 
           salary} = req.body;  

    if (!name || !email || !password || !role || !employeeId || !dob || !gender || !maritalStatus || !designation || !department || !salary) {
        return res.status(400).json({success:false, error:"All fields are required"});
    }

    const user = await User.findOne({email});
    // If use with the same email already exists then we will return the error response to the frontend 
    if(user){
        return res.status(400).json({success:false, error:"User with this email already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // this will create a new use in the database with the user details like name, email,password, role 
    // and profile image and then return the response to the frontend
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role,
        profileImage: req.file ? req.file.filename : "" // this will check if the file is uploaded and if yes then it will save the filename in the database otherwise it will save and empty string 
    });
    await newUser.save();

    const newEmployee = new Employee({
        userId: newUser._id, // this will save the user id in the employee collection to establish the relationship between user and employee
        employeeId,
        dob,
        gender,
        maritalStatus,
        designation,
        department,
        salary
    })

    await newEmployee.save();
    return res.status(201).json({success:true, message:"Employee added successfully"});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({success:false, error:"Internal server error"});
    }

}


const getEmployees = async (req, res)=>{
      try{
              // 
               const employee = await Employee.find().populate("userId",{password:0}).populate("department")
               return res.status(200).json({success:true,employee})
          }
          catch(e){
              return res.status(500).json({success:false, error:"get employee server error"});
              }

}
const getEmployee = async (req, res)=>{
      try{
              const { id } = req.params;
              const employee = await Employee.findById(id).populate("userId",{password:0}).populate("department")
              if (!employee) {
                  return res.status(404).json({success:false, error:"Employee not found"});
              }
               return res.status(200).json({success:true,employee})
          }
          catch(e){
              console.error(e);
              return res.status(500).json({success:false, error:"get employee server error"});
              }

}


const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    // this will extract the employee details from the request body and then find the employee in the database using the employee id and if the employee is found then it will update the employee details with the provided details in the request body and then save the updated employee details in the database and return the response to the frontend otherwise it will return the error response to the frontend if the employee is not found in the database and if there is any server error then it will return the error response to the frontend
    const {
      name,
      email,
      role,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    // Update employee fields if they are provided in the request body and then save the updated employee details in the database and return the response to the frontend
    if (employeeId) employee.employeeId = employeeId;
    if (dob) employee.dob = dob;
    if (gender) employee.gender = gender;
    if (maritalStatus) employee.maritalStatus = maritalStatus;
    if (designation) employee.designation = designation;
    if (department) employee.department = department;
    if (salary) employee.salary = salary;

    await employee.save();

    const user = await User.findById(employee.userId);
    if (user) {
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (req.file) user.profileImage = req.file.filename;
      await user.save();
    }

    const updatedEmployee = await Employee.findById(id).populate("userId",{password:0}).populate("department");
    return res.status(200).json({ success: true, employee: updatedEmployee });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, error: "update employee server error" });
  }
};

export {addEmployee, upload , getEmployees, getEmployee, updateEmployee};