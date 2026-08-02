import {User} from '../models/user.models.js';
import bcrypt from "bcryptjs";
import OTP from '../models/otp.models.js';
import { sendOtpEmail } from '../utils/email.js';
import jwt from "jsonwebtoken";


const generateToken = (id , role ) => {
    return jwt.sign({id , role} , process.env.JWT_SECRET , {expiresIn : "7d"})
}

// Register user
export const registerUser = async (req , res)=>{

    const {name , email , password} = req.body;

    let userExists = await User.findOne({email});
    
    if(userExists){
        return res.status(400).json({message : "User already exists"});
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const user = await User.create({name , email , password : hashedPassword , role: "user",isVerified: false});
    
        const otp = Math.floor(1000 + Math.random() * 9000);

        console.log(`OTP for ${email} : ${otp}`)

        await OTP.deleteMany({email , action:"account_verification"});
        await OTP.create({email , otp , action:"account_verification"});

        await sendOtpEmail(email , otp ,'account_verification')

        res.status(201).json({
            message:"User registered successfully, OTP sent to your email",
            email : user.email

        })
        
  



    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal server error"});
    }
}

// Login user
export const loginUser = async (req , res)=>{
    try {
        const {email , password} = req.body;
        if(!email || !password){
            return res.status(400).json({message : "All fields are required"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({message : "User not found"});
        }

        const isMatch = await bcrypt.compare(password ,user.password);
        
        if(!isMatch){
            return res.status(401).json({message : "Invalid credentials"});
        }

        if(!user.isVerified && user.role === 'user'){
            const otp = Math.floor(1000 + Math.random() * 9000);
            await OTP.deleteMany({email , action:"account_verification"});
            await OTP.create({email , otp , action:"account_verification"});
            await sendOtpEmail(email , otp ,'account_verification')
            return res.status(403).json({message : "Account not verified , A new OTP sent to your mail"});
        }

        res.status(200).json({
            message : "Login Success",
            user:{
                id: user._id,
                name : user.name,
                email: user.email,
                role : user.role,
                token: generateToken(user._id , user.role)
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Internal server error"});
    }
}


// Verify OTP 
export const verifyOTP = async (req , res)=>{
    

    const {email , otp} = req.body;

    if(!email || !otp){
        return res.status(400).json({message : "All fields are required"});
    }

    const otpRecord = await OTP.findOne({email , otp , action:"account_verification"});

    if(!otpRecord){
        return res.status(400).json({message : "Invalid OTP"});
    }

    const user = await User.findOne({email});

    if(!user){
        return res.status(404).json({message : "User not found"});
    }

    user.isVerified = true;
    await user.save();

    await OTP.deleteOne({email , action:"account_verification"});

    res.status(200)
    .json(
        {
            message : "OTP verified successfully",
            user : {
                id : user._id,
                name : user.name,
                email : user.email,
                role : user.role,
                token : generateToken(user._id , user.role)
            }
        
        }
    );

}       