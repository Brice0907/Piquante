import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name : { type: String, required: true },
    manufacturer : { type: String, required: true },
    description : { type: String, required: true },
    filename : { type: String, required: true },
    mainPepper : { type: String, required: true },
    heat : { type: Number, required: true },
    usersLiked: { type: [String], required: false },
    usersDisliked: { type: [String], required: false },
    userId: { type: String, required: true }
})


export default mongoose.model('Product', productSchema)
