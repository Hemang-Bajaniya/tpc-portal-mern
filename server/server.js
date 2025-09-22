import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// --- Local Imports ---
import connectDB from './util/db.js';
import authRoutes from './routes/auth.js';
import tpoRoutes from './routes/tpo.js';
import departmentRoutes from './routes/department.js';
import tpcRoutes from './routes/tpc.js';
import studentRoutes from './routes/student.js';

// --- Configuration ---
dotenv.config(); // Load environment variables from .env file

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true
}));
app.use(express.json()); // To parse JSON bodies
app.use(cookieParser()); // To parse cookies
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes'))); // Serve static files

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/tpo', tpoRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/tpc', tpcRoutes);
app.use("/api/student", studentRoutes);

// --- Root Endpoint ---
app.get('/', (req, res) => {
    res.send('TPC Portal API is running!');
});

// --- Start Server ---
const startServer = async () => {
    await connectDB(); // Connect to MongoDB
    app.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}`);
    });
};

startServer();
