require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Guardian = require("../models/guardianModel");
const Device = require("../models/deviceModel");
const createError = require("../utils/appError");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//REGISTER USER ACC
exports.registerUserAcc = async (req, res, next) => {
    try {
        const { email, fullname, username, gender, age, serialNumber, allowGuardian } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new createError("Email is already registered as a User!", 400));
        }

        const guardianExists = await Guardian.findOne({ email });
        if (guardianExists) {
            return next(new createError("Email is already registered as a Guardian!", 400));
        }

        const device = await Device.findOne({ serialNumber });
        if (!device) {
            return next(new createError("Invalid serial number", 400));
        }

        if (device.status === 'active') {
            return next(new createError("Device is already linked to another account", 400));
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const verificationToken = crypto.randomBytes(16).toString("hex");
        const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000); // 5 mins from now
        console.log("Expiry:", tokenExpirationDate);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            fullname,
            username,
            gender,
            age,
            deviceId: device._id,
            allowGuardian,
            verificationToken,
            tokenExpires: tokenExpirationDate,
            verified: false,
        });

        const link = `http://localhost:5000/api/auth/confirmEmail/${verificationToken}`;
        console.log("Verification link: " + link);

        // Send email
        await verifyEmail(newUser.email, link);

        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            // token,
            user: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

//REGISTER ADMIN ACC
exports.registerGuardianAcc = async (req, res, next) => {
    try {
        const { email, fullname, username, monitoredSerialNumbers } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new createError("Email is already registered as a User!", 400));
        }

        const guardianExists = await Guardian.findOne({ email });
        if (guardianExists) {
            return next(new createError("Email is already registered as a Guardian!", 400));
        }

        const devices = await Device.find({ serialNumber: { $in: monitoredSerialNumbers } });
        const foundSerials = devices.map((device) => device.serialNumber);
        const missingSerials = monitoredSerialNumbers.filter(sn => !foundSerials.includes(sn));

        if (missingSerials.length > 0) {
            return next(new createError(`Invalid serial number(s): ${missingSerials.join(', ')}`, 400));
        }

        const monitoredDevices = devices.map(device => device._id);

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const verificationToken = crypto.randomBytes(16).toString("hex");
        const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000); // 5 mins from now
        console.log("Expiry:", tokenExpirationDate);

        const newGuardian = await Guardian.create({
            email,
            password: hashedPassword,
            fullname,
            username,
            monitoredDevices,
            verificationToken, // Store the verification token directly in the user document
            tokenExpires: tokenExpirationDate,
            verified: false,
        });

        const link = `http://localhost:5000/api/auth/confirmEmail/${verificationToken}`;
        console.log("Verification link: " + link);

        // Send email
        await verifyEmail(newGuardian.email, link);

        res.status(201).json({
            status: "success",
            message: "Guardian registered successfully",
            verificationToken,
            user: {
                _id: newGuardian._id,
                username: newGuardian.username,
                email: newGuardian.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

// LOGIN USER
exports.logIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        let role = "user";

        if (!user) {
            user = await Guardian.findOne({ email });
            role = "guardian";
        }

        if (!user) return next(new createError("User not existed! Please Key In A Correct Email.", 404));

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
            return next(new createError("Invalid email or password", 401));

        if (user.verified) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            res.status(200).json({
                status: "success",
                token,
                message: "Logged in successfully",
                user: {
                    _id: user._id,
                    username: user.username,
                    fullname: user.fullname,
                    email: user.email,
                    role,
                },
            });
        } else {
            // User havn't verify their account
            await exports.resetVerificationToken(user);
            res.status(400).json({
                status: "error",
                message:
                    "You must verify your email. A new verification link has been sent.",
            });
        }
    } catch (error) {
        next(error);
    }
};

// SEND EMAIL TO VERIFY
async function verifyEmail(email, link) {

    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        //send email
        let info = await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Account Verification",
            text: "Welcome",
            html: `<h4>Verify Your Email Address</h4>
            <a href="${link}">Click this link to activate your account</a>`,
            //mail body
        });
        console.log("Mail send successfully: ", info);
    } catch (error) {
        console.log("Failed to send email:", error);
        throw error;
    }
}

// ACTIVE ACCOUNT
exports.confirmEmail = async (req, res) => {
    try {
        console.log("Accessed confirmEmail with token:", req.params.token);

        // Find user by verification token
        const user = await User.findOne({
            verificationToken: req.params.token,
        });

        if (!user) {
            return res.status(404).send("Verification token is invalid.");
        }

        // Check if the token has expired
        if (user.tokenExpires < new Date()) {
            // Token has expired
            console.log("Token has expired, generating a new one.");

            await resetVerificationToken(user);
            res.status(400).json({
                status: "error",
                message: "You must verify your email. A new verification link has been sent.",
            });

        }

        // If the user is already verified
        if (user.verified) {
            console.log("User already verified.");
            return res.status(400).send("User already verified.");
        }

        // Set user to verified and remove the verification token
        user.verified = true;
        user.verificationToken = null; // Remove token
        user.tokenExpires = null; // Clear the expiration date
        await user.save(); // Save the updated user

        res.send("Email verified successfully!");
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).send("An error occurred during the verification process.");
    }
};

async function resetVerificationToken(user) {
    const newToken = crypto.randomBytes(16).toString("hex");
    const newExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.verificationToken = newToken;
    user.tokenExpires = newExpiry;
    await user.save();

    const link = `http://localhost:5000/api/auth/confirmEmail/${newToken}`;
    await verifyEmail(user.email, link);
}

// FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        let user = await User.findOne({ email });
        let role = "user";

        if (!user) {
            user = await Guardian.findOne({ email });
            role = "guardian";
        }

        if (!user) return next(new createError("User not existed! Please Key In A Correct Email.", 404));

        // const tokenEmail = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET, { expiresIn: "5m" });
        const tokenEmail = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "5m" }
        );
        user.tokenEmail = tokenEmail;
        await user.save();

        let transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
        console.log("ID:", user._id, "Token:", tokenEmail);
        const link = `http://localhost:3000/resetPassword/${user._id}/${tokenEmail}/${role}`;
        console.log("Reset Password link: " + link);

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Reset Password",
            text: "Welcome",
            html: `<p>Click below link to reset your password</p>
            <a href="${link}">${link}</a>`,
        });

        console.log("Reset Password Mail sent successfully");
        res.status(200).json({
            status: "success",
            message: "Password reset email sent successfully",
        });
    } catch (error) {
        console.log("Failed to send email:", error);
        next(error);
    }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    const { id, token, role } = req.params;
    const { password } = req.body;

    try {
        let user;
        if (role === 'user') {
            user = await User.findById(id);
        } else {
            user = await Guardian.findById(id);
        }

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Check if token matches the one stored in DB
        if (user.tokenEmail !== token) {
            return res.status(403).json({
                Status: "Error",
                message: "Invalid or mismatched reset token",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const hashedPassword = await bcrypt.hash(password, 10);
        if (role === 'user') {
            await User.findByIdAndUpdate(id, {
                password: hashedPassword,
                tokenEmail: null,
            });
        } else {
            await Guardian.findByIdAndUpdate(id, {
                password: hashedPassword,
                tokenEmail: null,
            });
        }

        res.status(200).json({ Status: "Success", message: "Password successfully reset" });
    } catch (err) {
        console.log(err);
        if (err.name === "TokenExpiredError") {
            res.status(401).json({
                Status: "Error",
                message: "Token expired! Please request a new password reset link again",
            });
        } else {
            res.status(500).json({ Status: "Error", message: "Failed to reset password" });
        }
    }
};

// // GET user profile
// exports.getUserProfile = async (req, res, next) => {
//     try {
//         // Extract token from the request headers
//         const token = req.headers.authorization.split(" ")[1]; // Assuming token is sent in the "Authorization" header
//         console.log("Received token:", token);

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Retrieve user data using the user ID from the decoded token
//         const user = await User.findById(decoded.userId);
//         console.log("User data:", user);

//         if (!user) {
//             return res
//                 .status(404)
//                 .json({ status: "error", message: "User not found" });
//         }

//         res.status(200).json({
//             status: "success",
//             data: user,
//         });
//     } catch (error) {
//         console.error("Error fetching user profile:", error);
//         // Handle token verification errors
//         if (error.name === "JsonWebTokenError") {
//             return res
//                 .status(401)
//                 .json({ status: "error", message: "Invalid token" });
//         } else if (error.name === "TokenExpiredError") {
//             return res
//                 .status(401)
//                 .json({ status: "error", message: "Token expired" });
//         } else {
//             next(new createError("Internal Server Error", 500)); // Proper error handling
//         }
//     }
// };

// // UPDATE user profile
// exports.updateUserProfile = async (req, res) => {
//     console.log("Received data:", req.body);

//     try {
//         const token = req.headers.authorization.split(" ")[1]; // Get the token from header
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token

//         const user = await User.findById(decoded.userId);

//         const { editFullname, editUsername, editPhoneno, editEmail, editIC } =
//             req.body;

//         if (!user) {
//             return res
//                 .status(404)
//                 .json({ status: "error", message: "User not found" });
//         }

//         user.fullname = editFullname;
//         user.username = editUsername;
//         user.email = editEmail;
//         user.phonenumber = editPhoneno;
//         user.ic = editIC;

//         await user.save();
//         res.status(200).json({
//             status: "success",
//             message: "Profile updated successfully",
//             data: user,
//         });
//     } catch (error) {
//         console.error("Error updating user profile:", error);
//         res
//             .status(500)
//             .json({ status: "error", message: "Failed to update profile" });
//     }
// };
