import { Router } from "express"


import {
    forgotPassword,
    loginUser,
    registerUser,
    resetPassword
} from "../../auth/controllers/auth.controller"

import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema
} from "../validators/auth.validator"

import validate from "../../auth/middleware/auth.middleware"

const router = Router()


router.post(
    "/register",
    validate(registerSchema),
    registerUser
)
router.post("/login", validate(loginSchema), loginUser)
router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    forgotPassword
)
router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    resetPassword
)

export default router
