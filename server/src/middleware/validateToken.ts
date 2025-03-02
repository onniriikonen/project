import {Request, Response, NextFunction} from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()


// Extend Express Request interface to include user property
export interface CustomRequest extends Request {
    user?: JwtPayload
}


// Middleware to validate JWT token
export const validateToken = (req: CustomRequest, res: Response, next: NextFunction): void => {

    const token: string | undefined = req.header('authorization')?.split(" ")[1]

    if(!token) {
        res.status(401).json({message: "Access denied, missing token"})
        return 
    } 
    try {
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload
        req.user = verified
        next()

    } catch (error: any) {
        res.status(400).json({message: "Access denied, missing token"})
    }
}