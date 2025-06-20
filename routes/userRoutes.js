import express from 'express';
import { forgotPassword, login, register, VerifyOtp } from '../controllers/userController.js';


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", VerifyOtp);


export default router;