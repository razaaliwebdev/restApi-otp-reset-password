# Email OTP API

A robust Node.js REST API for user authentication and password reset using email-based OTP (One-Time Password). Built with Express, MongoDB (Mongoose), and Nodemailer.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
  - [Register](#register)
  - [Login](#login)
  - [Forgot Password (Send OTP)](#forgot-password-send-otp)
  - [Verify OTP & Reset Password](#verify-otp--reset-password)
- [User Model](#user-model)
- [Utilities](#utilities)
- [License](#license)

---

## Features

- **User Registration**: Create a new user with name, email, and password.
- **User Login**: Authenticate with email and password. Returns a JWT token in an HTTP-only cookie.
- **Forgot Password**: Request a password reset OTP sent to the user's email.
- **OTP Verification & Password Reset**: Verify OTP and set a new password.
- **Secure Password Hashing**: Passwords are hashed using bcrypt.
- **Email Delivery**: Uses Nodemailer for sending OTP emails.
- **MongoDB Integration**: User data is stored in MongoDB using Mongoose.
- **Environment-based Configuration**: All sensitive data is managed via environment variables.

---

## Tech Stack

- **Node.js** (ES Modules)
- **Express.js** (v5)
- **MongoDB** with **Mongoose**
- **Nodemailer** (for email delivery)
- **bcrypt** (for password hashing)
- **jsonwebtoken** (for JWT auth)
- **dotenv** (for environment variables)

---

## Project Structure

```
email-otp/
  app.js                # Express app setup
  server.js             # Server entry point
  config/
    db.js               # MongoDB connection logic
  controllers/
    userController.js   # User-related business logic
  models/
    userModel.js        # Mongoose user schema
  routes/
    userRoutes.js       # User-related API routes
  utils/
    generateOtp.js      # OTP generation utility
    sendEmail.js        # Email sending utility
  package.json
  .env                  # (You create this file)
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd email-otp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_MAIL=your_email_address
SMTP_PASSWORD=your_email_password
```

### 4. Start the server

```bash
npm run dev   # For development (nodemon)
# or
npm start     # For production
```

---

## API Endpoints

All endpoints are prefixed with `/api/auth`.

### 1. Register

- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Success Response:**
  - `201 Created`
  ```json
  {
    "message": "User registered successfully.",
    "user": { ...userObject }
  }
  ```
- **Errors:**
  - Missing fields, duplicate email, server errors.

---

### 2. Login

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Success Response:**
  - `200 OK` (Sets a `token` cookie)
  ```json
  {
    "message": "User Logged in Successfully",
    "user": { ...userObject }
  }
  ```
- **Errors:**
  - Invalid credentials, missing fields, server errors.

---

### 3. Forgot Password (Send OTP)

- **URL:** `/api/auth/forgot-password`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Success Response:**
  - `200 OK`
  ```json
  {
    "message": "OTP sent to the email"
  }
  ```
- **Errors:**
  - Email not found, missing email, server errors.

---

### 4. Verify OTP & Reset Password

- **URL:** `/api/auth/verify-otp`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "otp": "1234",
    "newPassword": "newpassword"
  }
  ```
- **Success Response:**
  - `200 OK`
  ```json
  {
    "message": "Password reset successfully."
  }
  ```
- **Errors:**
  - Invalid/expired OTP, missing fields, server errors.

---

## User Model

The user schema (Mongoose):

```js
{
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  otp:       { type: String },
  otpExpiry: { type: Date },
  verified:  { type: Boolean, default: false },
  timestamps: true
}
```

---

## Utilities

### OTP Generation

- **File:** `utils/generateOtp.js`
- **Logic:** Generates a random 4-digit OTP as a string.

### Email Sending

- **File:** `utils/sendEmail.js`
- **Logic:** Uses Nodemailer to send HTML emails. Requires SMTP credentials from environment variables.
- **Required ENV:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_MAIL`, `SMTP_PASSWORD`

---

## Environment Variables

| Variable      | Description                         |
| ------------- | ----------------------------------- |
| PORT          | Port for the server (default: 4000) |
| MONGO_URI     | MongoDB connection string           |
| JWT_SECRET    | Secret for JWT signing              |
| SMTP_HOST     | SMTP server host                    |
| SMTP_PORT     | SMTP server port                    |
| SMTP_MAIL     | Email address for sending emails    |
| SMTP_PASSWORD | Email password for SMTP             |

---

## License

ISC
