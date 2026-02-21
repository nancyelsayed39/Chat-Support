
import { Router } from "express";
import {  confirmEmail, signIn, forgotPassword, resetPassword, createAdmin } from "./admin.controller.js";

import { validate } from "../../middleware/validate.js";
import {  confirmEmailValidation, signInValidation, forgotPasswordValidation, resetPasswordValidation, createAdminValidation } from "./admin.validation.js";





const adminRouter = Router();

adminRouter.post('/signIn',validate(signInValidation),signIn)
adminRouter.post('/create',validate(createAdminValidation),createAdmin)
adminRouter.put('/verify',validate(confirmEmailValidation),confirmEmail)
adminRouter.post('/forgotPassword',validate(forgotPasswordValidation),forgotPassword)
adminRouter.put('/resetPassword',validate(resetPasswordValidation),resetPassword)





export default adminRouter
