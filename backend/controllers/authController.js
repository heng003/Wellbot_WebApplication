require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Guardian = require("../models/guardianModel");
const Device = require("../models/deviceModel");
const createError = require("../utils/appError");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// REGISTER USER ACC
exports.registerUserAcc = async (req, res, next) => {
    try {
        const { email, fullname, username, gender, age, language, culturalBackground, spiritualBeliefs, serialNumber, allowGuardian, password } = req.body;

        // Check if email or username exists in users or guardians
        const userExists = await User.findUserByEmail(email);
        if (userExists) {
            return next(new createError("Email is already registered as a User!", 400));
        }
        const guardianExists = await Guardian.findGuardianByEmailOrUsername(email);
        if (guardianExists && guardianExists.email === email) {
            return next(new createError("Email is already registered as a Guardian!", 400));
        }
        let usernameExists = await User.findUserByUsername(username);
        if (!usernameExists) {
            usernameExists = await Guardian.findGuardianByEmailOrUsername(username);
            if (usernameExists && usernameExists.username === username) {
                return next(new createError("Username already been registered", 400));
            }
        } else {
            return next(new createError("Username already been registered", 400));
        }

        // Find device by serial number
        const device = await Device.findDeviceBySerialAndStatus(serialNumber, 'inactive');
        if (!device) {
            return next(new createError("Invalid serial number or device already in use", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = crypto.randomBytes(16).toString("hex");
        const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000); // 5 mins from now

        // Create user
        const newUser = await User.createUser({
            email,
            password: hashedPassword,
            fullname,
            username,
            gender,
            age,
            language,
            cultural_background: culturalBackground,
            spiritual_beliefs: spiritualBeliefs,
            device_id: device.id,
            allow_guardian: allowGuardian,
            verification_token: verificationToken,
            token_expires: tokenExpirationDate,
            verified: false,
        });

        // Send verification email
        const link = `http://localhost:5000/api/auth/confirmEmail/${verificationToken}`;
        await verifyEmail(newUser.email, link);

        res.status(201).json({
            status: "success",
            message: "User registered successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

// REGISTER GUARDIAN ACC
exports.registerGuardianAcc = async (req, res, next) => {
    try {
        const { email, fullname, username, password } = req.body;

        const userExists = await User.findUserByEmail(email);
        if (userExists) {
            return next(new createError("Email is already registered as a User!", 400));
        }
        const guardianExists = await Guardian.findGuardianByEmailOrUsername(email);
        if (guardianExists && guardianExists.email === email) {
            return next(new createError("Email is already registered as a Guardian!", 400));
        }
        let usernameExists = await User.findUserByUsername(username);
        if (!usernameExists) {
            usernameExists = await Guardian.findGuardianByEmailOrUsername(username);
            if (usernameExists && usernameExists.username === username) {
                return next(new createError("Username already been registered", 400));
            }
        } else {
            return next(new createError("Username already been registered", 400));
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const verificationToken = crypto.randomBytes(16).toString("hex");
        const tokenExpirationDate = new Date(Date.now() + 5 * 60 * 1000); // 5 mins from now

        // Create guardian
        const newGuardian = await Guardian.createGuardian({
            email,
            password: hashedPassword,
            fullname,
            username,
            verification_token: verificationToken,
            token_expires: tokenExpirationDate,
            verified: false,
        });

        // Send verification email
        const link = `http://localhost:5000/api/auth/confirmEmail/${verificationToken}`;
        await verifyEmail(newGuardian.email, link);

        res.status(201).json({
            status: "success",
            message: "Guardian registered successfully",
            user: {
                id: newGuardian.id,
                username: newGuardian.username,
                email: newGuardian.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

// LOGIN USER/GUARDIAN
exports.logIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        let user = await User.findUserByEmail(email);
        let role = "user";

        if (!user) {
            user = await Guardian.findGuardianByEmailOrUsername(email);
            role = "guardian";
        }

        if (!user) return next(new createError("User not existed! Please Key In A Correct Email.", 404));

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid)
            return next(new createError("Invalid email or password", 401));

        if (user.verified) {
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            res.status(200).json({
                status: "success",
                token,
                message: "Logged in successfully",
                user: {
                    id: user.id,
                    username: user.username,
                    fullname: user.fullname,
                    email: user.email,
                    role,
                },
            });
        } else {
            // User hasn't verified their account
            await exports.resetVerificationToken(user, role);
            res.status(400).json({
                status: "error",
                message: "You must verify your email. A new verification link has been sent.",
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

        let info = await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Account Verification",
            text: "Welcome",
            html: `<h4>Verify Your Email Address</h4>
            <a href="${link}">Click this link to activate your account</a>`,
        });
        console.log("Mail sent successfully: ", info);
    } catch (error) {
        console.log("Failed to send email:", error);
        throw error;
    }
}

// ACTIVE ACCOUNT
exports.confirmEmail = async (req, res) => {
    try {
        const token = req.params.token;

        // Find user or guardian by verification token
        let user = await User.findUserByVerificationToken(token);
        let role = "user";
        if (!user) {
            user = await Guardian.findGuardianByEmailOrUsername(token);
            role = "guardian";
        }

        if (!user) {
            return res.status(404).send("Verification token is invalid.");
        }

        // Check if the token has expired
        if (user.token_expires < new Date()) {
            await exports.resetVerificationToken(user, role);
            return res.status(400).json({
                status: "error",
                message: "You must verify your email. A new verification link has been sent.",
            });
        }

        // If the user is already verified
        if (user.verified) {
            return res.status(400).send("User already verified.");
        }

        // Set user to verified and remove the verification token
        await (role === "user"
            ? User.updateUserById(user.id, { verified: true, verification_token: null, token_expires: null })
            : Guardian.updateGuardianById(user.id, { verified: true, verification_token: null, token_expires: null })
        );

        // If user, activate device
        if (role === "user" && user.device_id) {
            await Device.updateDeviceById(user.device_id, { status: "active" });
        }

        // Redirect to login page after success (frontend route)
        return res.send(`
            <html>
                <head>
                    <meta http-equiv="refresh" content="2;url=http://localhost:3000/login" />
                    <style>
                        body { font-family: Arial, sans-serif; background: #f8fafc; color: #0d9488; text-align: center; padding-top: 80px; }
                        .card { background: #fff; display: inline-block; padding: 2rem 3rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(16,24,40,0.08); }
                        h2 { margin-bottom: 1rem; }
                        p { color: #475569; }
                    </style>
                </head>
                <body>
                    <div class="card">
                        <h2>Email verified successfully!</h2>
                        <p>You will be redirected to the login page shortly.</p>
                    </div>
                    <script>
                        setTimeout(function() {
                            window.location.href = "http://localhost:3000/login";
                        }, 2000);
                    </script>
                </body>
            </html>
        `);
    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).send("An error occurred during the verification process.");
    }
};

exports.resetVerificationToken = async (user, role = "user") => {
    const newToken = crypto.randomBytes(16).toString("hex");
    const newExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (role === "user") {
        await User.updateUserById(user.id, {
            verification_token: newToken,
            token_expires: newExpiry,
        });
    } else {
        await Guardian.updateGuardianById(user.id, {
            verification_token: newToken,
            token_expires: newExpiry,
        });
    }

    const link = `http://localhost:5000/api/auth/confirmEmail/${newToken}`;
    await verifyEmail(user.email, link);
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        let user = await User.findUserByEmail(email);
        let role = "user";

        if (!user) {
            user = await Guardian.findGuardianByEmailOrUsername(email);
            role = "guardian";
        }

        if (!user) return next(new createError("User not existed! Please Key In A Correct Email.", 404));

        const tokenEmail = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "5m" }
        );

        // Save tokenEmail to user/guardian
        if (role === "user") {
            await User.updateUserById(user.id, { token_email: tokenEmail });
        } else {
            await Guardian.updateGuardianById(user.id, { token_email: tokenEmail });
        }

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

        const link = `http://localhost:3000/resetPassword/${user.id}/${tokenEmail}/${role}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: "Reset Password",
            text: "Welcome",
            html: `<p>Click below link to reset your password</p>
            <a href="${link}">${link}</a>`,
        });

        res.status(200).json({
            status: "success",
            message: "Password reset email sent successfully",
        });
    } catch (error) {
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
            user = await User.findUserById(id);
        } else {
            user = await Guardian.findGuardianById(id);
        }

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Check if token matches the one stored in DB
        if (user.token_email !== token) {
            return res.status(403).json({
                Status: "Error",
                message: "Invalid or mismatched reset token",
            });
        }

        // Verify token
        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    Status: "Error",
                    message: "Token expired! Please request a new password reset link again",
                });
            }
            throw err;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (role === 'user') {
            await User.updateUserById(id, {
                password: hashedPassword,
                token_email: null,
            });
        } else {
            await Guardian.updateGuardianById(id, {
                password: hashedPassword,
                token_email: null,
            });
        }

        res.status(200).json({ Status: "Success", message: "Password successfully reset" });
    } catch (err) {
        res.status(500).json({ Status: "Error", message: "Failed to reset password" });
    }
};

// GET user profile with device info
exports.getUserProfile = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve user data using Supabase model function
        const user = await User.findUserById(decoded.userId);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // Get device info if device_id exists
        let serialNumber = null;
        if (user.device_id) {
            const device = await Device.findDeviceById(user.device_id);
            if (device) {
                serialNumber = device.serial_number;
            }
        }

        res.status(200).json({
            status: "success",
            data: {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                age: user.age,
                gender: user.gender,
                language: user.language,
                spiritualBeliefs: user.spiritual_beliefs,
                culturalBackground: user.cultural_background,
                allowGuardian: user.allow_guardian,
                deviceId: user.device_id || null,
                serialNumber: serialNumber || null
            }
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ status: "error", message: "Invalid token" });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ status: "error", message: "Token expired" });
        } else {
            next(new createError("Internal Server Error", 500));
        }
    }
};

// UPDATE user profile
exports.updateUserProfile = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findUserById(decoded.userId);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // Prepare update object
        const {
            fullname,
            username,
            age,
            gender,
            language,
            culturalBackground,
            spiritualBeliefs
        } = req.body;

        const updateObj = {};
        if (fullname !== undefined) updateObj.fullname = fullname;
        if (username !== undefined) updateObj.username = username;
        if (age !== undefined) updateObj.age = age;
        if (gender !== undefined) updateObj.gender = gender;
        if (language !== undefined) updateObj.language = language;
        if (culturalBackground !== undefined) updateObj.cultural_background = culturalBackground;
        if (spiritualBeliefs !== undefined) updateObj.spiritual_beliefs = spiritualBeliefs;

        // Update user in Supabase
        const updatedUser = await User.updateUserById(user.id, updateObj);

        res.status(200).json({
            status: "success",
            message: "Profile updated successfully",
            data: {
                id: updatedUser.id,
                fullname: updatedUser.fullname,
                username: updatedUser.username,
                age: updatedUser.age,
                gender: updatedUser.gender,
                language: updatedUser.language,
                culturalBackground: updatedUser.cultural_background,
                spiritualBeliefs: updatedUser.spiritual_beliefs
            }
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ status: "error", message: "Failed to update profile" });
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { currentPassword, newPassword } = req.body;
        const user = await User.findUserById(decoded.userId);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await User.updateUserById(user.id, { password: hashedPassword });

        res.status(200).json({ status: "success", message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
};

// CHANGE DEVICE
exports.changeDevice = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { serialNumber } = req.body;
        const user = await User.findUserById(decoded.userId);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const newDevice = await Device.findDeviceBySerialAndStatus(serialNumber, "inactive");
        if (!newDevice) {
            return res.status(400).json({ status: "error", message: "Device not found or already in use" });
        }

        // Set old device to inactive
        if (user.device_id) {
            await Device.updateDeviceById(user.device_id, { status: "inactive" });
        }

        // Set new device to active
        await Device.updateDeviceById(newDevice.id, { status: "active" });

        // Update user
        await User.updateUserById(user.id, { device_id: newDevice.id });

        res.status(200).json({ status: "success", message: "Device changed successfully" });
    } catch (error) {
        next(error);
    }
};

// UPDATE GUARDIAN PERMISSION
exports.updateGuardianPermission = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { allowGuardian } = req.body;
        const user = await User.findUserById(decoded.userId);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        await User.updateUserById(user.id, { allow_guardian: !!allowGuardian });

        res.status(200).json({ status: "success", message: "Guardian permission updated", allowGuardian: !!allowGuardian });
    } catch (error) {
        next(error);
    }
};