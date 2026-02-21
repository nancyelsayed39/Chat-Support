
import Joi from 'joi'



const signUpValidation = Joi.object({
    name: Joi.string().pattern(/^[A-Za-z\s]+$/).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
})


const confirmEmailValidation = Joi.object({
    code: Joi.string().pattern(/^\d{6}$/).required(),
})

const signInValidation = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
})

const forgotPasswordValidation = Joi.object({
    email: Joi.string().email().required(),
})

const resetPasswordValidation = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().pattern(/^\d{6}$/).required(),
    newPassword: Joi.string().pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).required(),
})

const createAdminValidation = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
})

export { signUpValidation, confirmEmailValidation, signInValidation, forgotPasswordValidation, resetPasswordValidation, createAdminValidation }
