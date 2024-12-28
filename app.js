import express from 'express';
import morgan from 'morgan';
import connect from './db/db.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

// Initialize Database Connection
try {
    connect();
    console.log('Database connected successfully.');
} catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1); // Exit process if the DB connection fails
}

const app = express();

// Middleware
app.use(
    cors({
        origin: 'http://localhost:5173', // Allow frontend URI
        credentials: true, // Enable credentials for cookie handling
    })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

// Global Error-Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error details for debugging
    res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
