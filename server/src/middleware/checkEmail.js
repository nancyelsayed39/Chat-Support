
import { AppError } from "../utils/appError.js"
import Admin from "../../db/models/admin.model.js";


export const checkEmail = async(req,res,next)=>{
    let isExist = await Admin.findOne({email :req.body.email})
    if(isExist) return next(new AppError("Email is already exist",409))
        next()

}