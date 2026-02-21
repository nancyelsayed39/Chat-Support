import { AppError } from "../utils/appError.js"


export const validate = (schema ,imageKey)=>{
    return async (req,res,next)=>{
        console.log("🔍 [VALIDATE] Started validation for:", req.path)
        
        const dataToValidate = { ...req.body, ...req.params, ...req.query };

        if (req.file){
            dataToValidate[imageKey] =req.file
        }
        if (req.files){
            Object.assign(dataToValidate, { ...req.files });
        }

        console.log("📦 [VALIDATE] Data to validate:", dataToValidate)
        let {error} =  schema.validate(dataToValidate,{abortEarly:false})
        
        if(!error){
            console.log("✅ [VALIDATE] Validation passed")
            next()
        }else{
            console.log("❌ [VALIDATE] Validation failed:", error.details)
            let errMsgs = error.details.map(err=>err.message)
            next(new AppError(errMsgs,401))
        }
    }
}