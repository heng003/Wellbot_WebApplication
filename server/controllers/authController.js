require('dotenv').config();
const bcrypt = require('bcrypt');   // bcryptjs
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const createError = require('../utils/appError');
const nodemailer = require('nodemailer');
const crypto = require('crypto')

//REGISTER LANDLORD ACC
exports.registerLandlordAcc = async(req,res,next) => {
    try {
        const { email, username, phonenumber, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new createError("User already exists!", 400));
        }
        const hashedPassword = await bcrypt.hash(req.body.password,12);
        const verificationToken = crypto.randomBytes(16).toString("hex");
        const tokenExpirationDate = new Date(Date.now() + 24*60*60*1000);

        const newUser = await User.create({
            email,
            password: hashedPassword,
            username,
            phonenumber,
            role,
            verificationToken,  // Store the verification token directly in the user document
            tokenExpires: tokenExpirationDate, 
            verified: false
        });

        const link = `http://localhost:3000/api/auth/confirmEmail/${verificationToken}`;
        console.log("Verification link: " + link);

        // Send email
        await verifyEmail(newUser.email, link);

        res.status(201).json({
            status:'success',
            message:'User registered successfully',
            verificationToken,
            user:{
                _id:newUser._id,
                username:newUser.username,
                email:newUser.email,
                phonenumber:newUser.phonenumber,
            },
        });

    } catch (error) {
        next(error);
    }
};

//REGISTER TENANT ACC
exports.registerTenantAcc = async(req,res,next) => {
    try {
        const { email, username, phonenumber, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return next(new createError("User already exists!", 400));
        }
        const hashedPassword = await bcrypt.hash(req.body.password,12);
        const verificationToken = crypto.randomBytes(16).toString("hex");
        const newUser = await User.create({
            email,
            password: hashedPassword,
            username,
            phonenumber,
            role,
            verificationToken,  // Store the verification token directly in the user document
            verified: false
        });

        const link = `http://localhost:3000/api/auth/confirmEmail/${verificationToken}`;
        console.log("Verification link: " + link);

        // Send email
        await verifyEmail(newUser.email, link);

        res.status(201).json({
            status:'success',
            message:'User registered successfully',
            // token,
            user:{
                _id:newUser._id,
                username:newUser.username,
                email:newUser.email,
                phonenumber:newUser.phonenumber,
            },
        });

    } catch (error) {
        next(error);
    }
};

// LOGIN USER
exports.logIn = async(req,res,next) => {
    try {
        const{email, password} = req.body;
        const user = await User.findOne({email});
        if(!user)
            return next(new createError("User not found",404));

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid)
            return next(new createError("Invalid email or password",401));

        if(user.verified){
            const token = jwt.sign({ _id: user._id }, 'secretkey123',{
                expiresIn: '7d',
            });
            res.status(200).json({
                status: 'success',
                token,
                message: "Logged in successfully",
                user:{
                    _id:user._id,
                    username:user.username,
                    email:user.email,
                    phonenumber:user.phonenumber,
                },
            })
        }
        // else{
        //     let token = await Token.findOne({userId:user._id});
        //     if(!token){
        //         const token = new Token({userId:newUser._id, token:crypto.randomBytes(16).toString("hex")});
        //         await token.save();
        //         console.log("Token: " + token + "\n");

        //         const link = `http://localhost:3000/api/auth/confirmEmail/${token.token}`;

        //         console.log("Verification link: " + link);

        //         // Send email
        //         await verifyEmail(newUser.email, link);
        //     }
        //     return res.status(404).send({message: "An email sent to your account pleas verify!"})
        // }

    } catch (error) {
        next(error);
    }
};

// VERIFY EMAIL
async function verifyEmail(email,link){
    console.log("Sending verification email to:", email);
    console.log("Verification link:", link);

    try {
        let transporter = nodemailer.createTransport({
            service:"gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            }
        })
    
        //send email
        let info = await transporter.sendMail({
            from:process.env.EMAIL_USERNAME,
            to:email,
            subject:"Account Verification",
            text:"Welcome",
            html: `<h4>Verify Your Email Address</h4>
            <a href="${link}">Click this link to activate your account</a>`
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
            verificationToken: req.params.token
        });
        
        if (!user) {
            console.log("User with token not found.");
            return res.status(404).send("User is not register!");
        }

        // Check if the token has expired
        if (user.tokenExpires < new Date()) {
            return res.status(400).json({
            error: "Token has expired",
            actionRequired: true
        });
        }
        
        // If the user is already verified
        if (user.verified) {
            console.log("User already verified.");
            return res.status(400).send("User already verified.");
        }

        // Set user to verified and remove the verification token
        user.verified = true;
        user.verificationToken = undefined; // Remove token
        user.tokenExpires = undefined; // Clear the expiration date
        await user.save(); // Save the updated user

        res.send("Email verified successfully!");

    } catch (error) {
        console.error("Error verifying email:", error);
        res.status(500).send("An error occurred during the verification process.");
    }
};

exports.resetVerificationToken = async (req, res) => {
    try {
        const { email } = req.body; // Assuming the user submits their email to request a new token
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found.");
        }

        // Generate a new token
        const newToken = crypto.randomBytes(16).toString("hex");
        const newTokenExpiration = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

        // Update user with new token and expiration
        user.verificationToken = newToken;
        user.tokenExpiration = newTokenExpiration;
        await user.save();

        // Resend the verification email
        const link = `http://localhost:3000/api/auth/confirmEmail/${newToken}`;
        await verifyEmail(user.email, link);

        res.send("A new verification link has been sent to your email.");
    } catch (error) {
        console.error("Error resetting verification token:", error);
        res.status(500).send("Unable to reset verification token.");
    }
};
