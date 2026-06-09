import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToDatabase from './db/db.js';
import authRouter from './routes/auth.js';
import departmentRouter from "./routes/department.js";
import employeeRouter from "./routes/employee.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('public/uploads')); // this will serve the static files from the public folder to the frontend so that we can access the uploaded profile images in the frontend using the url http://localhost:4000/public/uploads/filename
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use("/api/department", departmentRouter);
app.use("/api/employee", employeeRouter);


connectToDatabase();

app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});