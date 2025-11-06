import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './util/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import tpoRoutes from './routes/tpo.js';
import departmentRoutes from './routes/department.js';
import tpcRoutes from './routes/tpc.js';
import studentRoutes from './routes/student.js';
import companyRoutes from './routes/company.js';
import jobRoutes from './routes/jobs.js';
import commonRoutes from './routes/common.js';
import driveRoutes from './routes/driveRoutes.js';
import userRoutes from './routes/user.js';

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);


dotenv.config();
const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5173'],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));
app.use('/uploads/results', express.static(path.join(__dirname, 'uploads/results')));

// Auth routes
app.use('/api/auth', authRoutes);

// TPO routes
app.use('/api/tpo', tpoRoutes);

// Department routes
app.use('/api/department', departmentRoutes);

// TPC routes
app.use('/api/tpc', tpcRoutes);

// STudent routes
app.use("/api/student", studentRoutes);

// company routes
app.use("/api/companies", companyRoutes);

// job routes
app.use("/api/jobs", jobRoutes);

//common routes
app.use("/api/common", commonRoutes);

//drive routes
app.use("/api/drives", driveRoutes);

//user routes
app.use('/api/users',userRoutes);
connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello TPC!');
});

app.get("/hello", (_, res) => res.send("Hello Endpoint"));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});