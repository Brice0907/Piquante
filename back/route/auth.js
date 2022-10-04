import Express from "express";
import * as AuthControler from "../controller/auth.js"

const router = Express.Router()

router.post('/signup', AuthControler.signup)
router.post('/login', AuthControler.login)


export default router