import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import generateOtp from '../utils/generateOtp.js';
import sendEmail from '../utils/sendEmail.js';



// Register Controller
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All the fields are required."
            });
        };

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({
                message: "User already exists with this email"
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create(
            {
                name,
                email,
                password: hashedPassword
            }
        );

        return res.status(201).json({
            message: "User registered successfully.",
            user
        });


    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    };
};


// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All the fields are required."
            });
        };

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        };

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, { httpOnly: true }).json({
            message: "User Logged in Successfully",
            user
        });


    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    };
};


// Forgot-Password Controller
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const otp = generateOtp(); // fixed typo
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        user.otp = otp;

        const subject = `Welcome to SELLO!`; // fixed typo

        const html = `
<div style="font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #fffdf7 0%, #fff8e9 100%); padding: 40px 0; max-width: 600px; margin: auto;">
  <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(255, 166, 0, 0.15); border: 1px solid #fff0d0;">
    <!-- Header with gradient -->
    <div style="background: linear-gradient(135deg, #FFA602 0%, #FF6B00 100%); padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 36px; font-weight: 700; letter-spacing: -0.5px;">
        Welcome to <span style="text-shadow: 0 2px 4px rgba(0,0,0,0.1);">SELLO</span>! 🚗
      </h1>
      <div style="height: 4px; width: 80px; background: rgba(255,255,255,0.3); margin: 15px auto 0;"></div>
    </div>

    <!-- Body Content -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 18px; color: #555; line-height: 1.6; margin-bottom: 25px;">
        Hi there,<br>
        Thank you for joining <b style="color: #FF6B00;">SELLO</b> - your trusted automotive marketplace!
      </p>
      
      <p style="font-size: 17px; color: #444; line-height: 1.6;">
        Please use this One-Time Password to verify your email:
      </p>
      
      <!-- OTP Container -->
      <div style="background: #fef9f0; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center; border: 1px dashed #FFA602;">
        <div style="font-size: 38px; font-weight: 800; color: #FF6B00; letter-spacing: 6px; padding: 10px; font-family: monospace;">
          ${otp}
        </div>
      </div>
      
      <div style="display: flex; align-items: center; background: #f8f9ff; border-radius: 10px; padding: 16px; margin-top: 30px;">
        <div style="font-size: 24px; margin-right: 15px;">⏱️</div>
        <p style="font-size: 14px; color: #666; margin: 0;">
          <b>Important:</b> This code expires in <span style="color: #FF6B00;">10 minutes</span>.
          Never share this code with anyone.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #fafafa; padding: 25px; text-align: center; border-top: 1px solid #f0f0f0;">
      <p style="font-size: 18px; margin: 0 0 15px 0; color: #FF6B00; font-weight: 600;">
        Happy Selling!
      </p>
      <p style="margin: 8px 0; font-size: 14px; color: #888;">
        The SELLO Team
      </p>
      <div style="margin-top: 20px;">
        <a href="#" style="display: inline-block; margin: 0 10px;">
          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="28" style="opacity: 0.7;">
        </a>
        <a href="#" style="display: inline-block; margin: 0 10px;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" width="28" style="opacity: 0.7;">
        </a>
        <a href="#" style="display: inline-block; margin: 0 10px;">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="28" style="opacity: 0.7;">
        </a>
      </div>
      <p style="margin: 20px 0 0; font-size: 12px; color: #aaa;">
        © 2023 SELLO Automotive Marketplace. All rights reserved.
      </p>
    </div>
  </div>
</div>
`;

        await sendEmail(email, subject, html);
        await user.save(); // <--- Don't forget to save the user!

        res.status(200).json({
            message: "OTP sent to the email"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};



// Veriffy-OTP Controller
export const VerifyOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                message: "Email, OTP, and new password are required"
            });
        }

        const user = await User.findOne({ email });
        console.log("Found user:", user);

        if (
            !user ||
            String(user.otp).trim() !== String(otp).trim() ||
            !user.otpExpiry ||
            new Date(user.otpExpiry).getTime() < Date.now()
        ) {
            console.log("OTP mismatch or expired. Stored:", user?.otp, "Provided:", otp);
            return res.status(400).json({
                message: "Invalid or expired OTP"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully."
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        return res.status(500).json({
            message: error.message
        });
    }
};






