import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoutes.js';

dotenv.config();

export const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
app.get("/", (req, res) => {
    res.send("<h1>API Working Fine....</h2>");
});

app.use("/api/auth", userRouter);


