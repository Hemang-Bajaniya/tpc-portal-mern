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
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__dirname);


dotenv.config();
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));

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

connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello TPC!');
});

app.get("/hello", (_, res) => res.send("Hello Endpoint"));

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});