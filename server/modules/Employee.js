import mongoose from "mongoose";
import { Schema } from "mongoose";

const employeeSchema = new Schema({
    // Reference to the User model to link employee with user details like name, email, password, role and profile image

    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    employeeId: { type: String, required: true },
    dob: { type: Date},
    gender:{ type: String},
    maritalStatus: { type: String},
    designation: { type: String},
    department: { type: Schema.Types.ObjectId, ref: "Department", required: true },// Reference to the Department model to link employee with department details 
    salary: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }

})


const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;