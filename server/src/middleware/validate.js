import { AppError } from "../utils/appError.js"


export const validate = (schema ,imageKey)=>{
    return async (req,res,next)=>{

        const dataToValidate = { ...req.body, ...req.params, ...req.query };

        if (req.file){
            dataToValidate[imageKey] =req.file
        }
        if (req.files){
            Object.assign(dataToValidate, { ...req.files });
        }

        let {error} =  schema.validate(dataToValidate,{abortEarly:false})
        if(!error){
            next()
            console.log(dataToValidate)
        }else{
            let errMsgs = error.details.map(err=>err.message)
            next(new AppError(errMsgs,401))

        }
    }
}