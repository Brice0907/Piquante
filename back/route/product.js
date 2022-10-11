import Express from "express";
import auth from "../middleware/auth.js"
import * as Productcontroller from "../controller/product.js";
import multer from "../middleware/multer-config.js";

const router = Express.Router()

router.post('/', auth, multer, Productcontroller.add)
router.get('/', auth, Productcontroller.all)
router.get('/:id', auth, Productcontroller.one)
router.delete('/:id', auth, Productcontroller.suppr)
router.put('/:id', auth, multer, Productcontroller.modif)
router.post('/:id/like', auth, Productcontroller.liked)

export default router