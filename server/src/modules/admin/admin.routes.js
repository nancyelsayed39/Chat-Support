
import { Router } from "express";
import {  confirmEmail, signIn, forgotPassword, resetPassword } from "./admin.controller.js";

import { validate } from "../../middleware/validate.js";
import {  confirmEmailValidation, signInValidation, forgotPasswordValidation, resetPasswordValidation } from "./admin.validation.js";





const adminRouter = Router();

adminRouter.post('/signIn',validate(signInValidation),signIn)
adminRouter.put('/verify',validate(confirmEmailValidation),confirmEmail)
adminRouter.post('/forgotPassword',validate(forgotPasswordValidation),forgotPassword)
adminRouter.put('/resetPassword',validate(resetPasswordValidation),resetPassword)





export default adminRouter
