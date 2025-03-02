import { Request, Response, Router } from 'express'
import { body, Result, ValidationError, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User, IUser } from '../models/User'

const router: Router = Router();

// Register a user
router.post("/register",
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({min: 3}).withMessage("Password must be at least 3 characters long"),
    body("username").notEmpty().withMessage("Username is required"),
    async (req: Request, res: Response) => {
        const errors: Result<ValidationError> = validationResult(req)

        if(!errors.isEmpty()) {
            console.log(errors);
            res.status(400).json({errors: errors.array()})
            return
        }
    try {
        const existingUser = await User.findOne({ email: req.body.email })
        if (existingUser) {
            res.status(403).json({email: "Email already in use"})
            return
        }

        const salt: string = bcrypt.genSaltSync(10)
        const hash: string = bcrypt.hashSync(req.body.password, salt)

        await User.create({
            email: req.body.email,
            password: hash,
            username: req.body.username,
            isAdmin: req.body.isAdmin || false,
        })

        res.status(200).json({message: "User registered successfully"})

        return 

    } catch (error: any) {
        console.error(`Error during registration: ${error}`)
        res.status(500).json({error: "Internal Server Error"})
        return 
    }

    }
)

// Login
router.post("/login",
    body("email").isEmail(),
    body("password").exists(),
    async (req: Request, res: Response) => {

        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })

            if (!user) {
                res.status(401).json({message: "Login failed"})
                return
            }

            const valid = bcrypt.compareSync(password, user.password);

            if (!valid) {
                res.status(401).json({ message: "Invalid email or password" });
                return
            } 

            const jwtPayload: JwtPayload = {
                email: user.email,
                _id: user._id,
                username: user.username,
                isAdmin: user.isAdmin,
            };

            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: "20m"})

            res.status(200).json({success: true, token})

            return


        } catch(error: any) {
            console.error(`Error during user login: ${error}`)
            res.status(500).json({ error: 'Internal Server Error' })
            return
        }
    }
)



export default router