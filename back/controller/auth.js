import bcrypt, { hash } from "bcrypt";
import User from "../models/user.js";
import jsonwebtoken from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = new User({
            email: req.body.email,
            password: hash,
        })
        await user.save()
        res.status(201).json({
            message: 'Création d\'un compte'
        })
    } catch (error) {
        res.status(400).json({ error })
        console.error(error);
    }
    next()
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ message: 'Identifiant/Mot de passe incorrecte' })
        }
        const valid = await bcrypt.compare(req.body.password, user.password)
        if (!valid) {
            return res.status(401).json({ message: 'Identifiant/Mot de passe incorrecte' })
        }
        res.status(200).json({
            userId: user._id,
            token: jsonwebtoken.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
            )
        })
    } catch (error) {
        res.status(500).json({ error })
    }
}

