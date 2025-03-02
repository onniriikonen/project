"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
// Register a user
router.post("/register", (0, express_validator_1.body)("email").isEmail().withMessage("Invalid email format"), (0, express_validator_1.body)("password").isLength({ min: 3 }).withMessage("Password must be at least 3 characters long"), (0, express_validator_1.body)("username").notEmpty().withMessage("Username is required"), async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const existingUser = await User_1.User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(403).json({ email: "Email already in use" });
            return;
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        await User_1.User.create({
            email: req.body.email,
            password: hash,
            username: req.body.username,
            isAdmin: req.body.isAdmin || false,
        });
        res.status(200).json({ message: "User registered successfully" });
        return;
    }
    catch (error) {
        console.error(`Error during registration: ${error}`);
        res.status(500).json({ error: "Internal Server Error" });
        return;
    }
});
// Login
router.post("/login", (0, express_validator_1.body)("email").isEmail(), (0, express_validator_1.body)("password").exists(), async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Login failed" });
            return;
        }
        const valid = bcrypt_1.default.compareSync(password, user.password);
        if (!valid) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const jwtPayload = {
            email: user.email,
            _id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
        };
        const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "20m" });
        res.status(200).json({ success: true, token });
        return;
    }
    catch (error) {
        console.error(`Error during user login: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
});
exports.default = router;
