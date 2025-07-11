import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../../shared/config/jwt.config"

export const generateToken = (
    payload: object,
    expiresIn = "7d"
) => {
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, {
        expiresIn
    })
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET as jwt.Secret)
}
