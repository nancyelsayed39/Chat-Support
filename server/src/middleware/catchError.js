import { AppError } from "../utils/appError.js";


export const catchError = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(err=>{
            console.error("Caught error:", err);
            next(new AppError(err.message || err, 500));
        })
    }
}
