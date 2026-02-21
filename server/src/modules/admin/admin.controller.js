
import { catchError } from "../../middleware/catchError.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AppError } from "../../utils/appError.js";
import { sendEmail } from "../../email/nodemailer.js";
import { htmlCode } from "../../email/html.js";
import Admin from "../../../db/models/admin.model.js";

const signIn = catchError(async(req,res,next)=>{
    let user = await Admin.findOne({email:req.body.email})
    if(!user) return next(new AppError("incorrect email or password" , 401))

    if(user.verified == false) {
        let code = Math.floor(100000 + Math.random() * 900000)
        user.otpCode = code
        user.otpExpire =Date.now() + 5 * 60 * 1000; // 5 minutes
        await user.save()
        await sendEmail({email:user.email,subject:"verify email" ,html:htmlCode(user.otpCode)})
        
    }
    if(user && bcrypt.compareSync(req.body.password , user.password)){
        //----
        let token = jwt.sign({userId:user._id, email:user.email, name: user.name, role :user.role},process.env.JWT_KEY,{ expiresIn:'1d' })
        await Admin.findByIdAndUpdate(user._id,{online:true},{new:true})
        return res.json({message : "success" , token})
    }
    next(new AppError("incorrect email or password" , 401))
})

const confirmEmail = catchError(async(req,res,next)=>{
    const {token} = req.headers
    let userPayload=null
    jwt.verify(token , process.env.JWT_KEY ,(err,payload)=>{
        if(err) return next(new AppError(err , 401))
            userPayload = payload
    })

    let user = await Admin.findOne({_id:userPayload.userId,verified:false})
    console.log(user);
    
    if(!user) return next(new AppError("invalid email or email already verified",400))
    if(user.otpCode != req.body.code) return next(new AppError("invalid otp code",400))

    if(user.otpExpire < Date.now()) return next(new AppError("code expired",404))
        user.verified = true
        user.online =true
        user.otpCode=undefined
        user.otpExpire=undefined
        await user.save()
        res.status(201).json({message:'email confirmed successfuly'})
    
    
}) 



const forgotPassword = catchError(async(req,res,next)=>{
    const {email} = req.body
    let user = await Admin.findOne({email})
    if(!user) return next(new AppError("Email not found" , 404))

    // Generate reset code
    let resetCode = Math.floor(100000 + Math.random() * 900000)
    user.otpCode = resetCode
    user.otpExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save()

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/#/reset-password?code=${resetCode}&email=${email}`
    await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        html: `
            <h2>Password Reset</h2>
            <p>You requested a password reset. Use this code to reset your password:</p>
            <h3 style="color: #128c7e; font-size: 24px; letter-spacing: 5px;">${resetCode}</h3>
            <p>This code expires in 15 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `
    })

    res.json({message: "Password reset code sent to your email"})
})

const resetPassword = catchError(async(req,res,next)=>{
    const {email, code, newPassword} = req.body
    
    let user = await Admin.findOne({email, otpCode: code})
    if(!user) return next(new AppError("Invalid email or code" , 400))
    
    if(user.otpExpire < Date.now()) return next(new AppError("Code expired" , 400))
    
    user.password = newPassword
    user.otpCode = undefined
    user.otpExpire = undefined
    await user.save()
    
    res.json({message: "Password reset successfully"})
})

const createAdmin = catchError(async(req,res,next)=>{
    console.log("🔍 createAdmin request received:", req.body)
    const {email, password, name} = req.body
    
    console.log("✅ Validating input...")
    if(!email || !password || !name) return next(new AppError("Email, password, and name are required", 400))
    
    // Check if admin already exists
    console.log("🔄 Checking if admin exists...")
    let existingAdmin = await Admin.findOne({email})
    if(existingAdmin) return next(new AppError("Admin with this email already exists", 400))
    
    // Create new admin
    console.log("➕ Creating new admin...")
    let newAdmin = new Admin({
        email,
        password,
        name,
        verified: true  // Admin created via API is already verified
    })
    
    console.log("💾 Saving admin to database...")
    await newAdmin.save()
    
    console.log("✅ Admin created successfully")
    res.status(201).json({
        message: "Admin created successfully",
        admin: {
            _id: newAdmin._id,
            email: newAdmin.email,
            name: newAdmin.name,
            role: newAdmin.role
        }
    })
})

export { signIn , confirmEmail , forgotPassword, resetPassword, createAdmin }
