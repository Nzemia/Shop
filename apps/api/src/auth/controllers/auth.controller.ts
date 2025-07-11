import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../../shared/config/database.config"
import { JWT_SECRET } from "../../shared/config/jwt.config"
import { transporter } from "../../shared/config/email.config"

export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email, username, password } = req.body

    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
    })
    if (existingUser)
        res.status(400).json({
            message: "User already exists"
        })

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: { email, username, password: hashedPassword }
    })

    res.status(201).json({
        message: "Registration successful",
        user: {
            id: user.id,
            email: user.email,
            username: user.username
        }
    })
}

export const loginUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
        where: { email }
    })
    if (!user) {
        res.status(400).json({
            message: "Invalid credentials"
        })
        return
    }

    const isMatch = await bcrypt.compare(
        password,
        user.password
    )
    if (!isMatch)
        res.status(400).json({
            message: "Invalid credentials"
        })

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined")
    }
    const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
    )

    res.status(200).json({
        token,
        user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role
        }
    })
}

export const forgotPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { email } = req.body

    const user = await prisma.user.findUnique({
        where: { email }
    })
    if (!user) {
        res.status(404).json({ message: "Email not found" })
        return
    }

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined")
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "15m"
    })

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    await transporter.sendMail({
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link expires in 15 minutes.</p>`
    })

    res.status(200).json({
        message: "Password reset link sent"
    })
}

export const resetPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { token, newPassword } = req.body

    try {
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined")
        }
        const payload = jwt.verify(
            token,
            JWT_SECRET
        ) as unknown as { id: string }
        const hashed = await bcrypt.hash(newPassword, 10)

        await prisma.user.update({
            where: { id: payload.id },
            data: { password: hashed }
        })

        res.status(200).json({
            message: "Password reset successful"
        })
    } catch {
        res.status(400).json({
            message: "Invalid or expired token"
        })
    }
}
