import Product from "../models/product.js";
import fs from 'fs';

function normalizeProduct(product, req) {
    return {
        ...product.toObject(),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${product.filename}`,
        likes: product.usersLiked.length,
        dislikes: product.usersDisliked.length,
    }
}

export const add = async (req, res, next) => {
    try {
        const productObject = JSON.parse(req.body.sauce)
        delete productObject.userId
        const product = new Product({
            ...productObject,
            name: productObject.name,
            manufacturer: productObject.manufacturer,
            description: productObject.description,
            filename: req.file.filename,
            mainPepper: productObject.mainPepper,
            heat: productObject.heat,
            userId: req.auth.userId,
        })
        await product.save()
        res.status(201).json({ message: 'Ajout d\'une sauce' })
    } catch (error) {
        res.status(400).json({ error })
        console.error(error);
    }
    next()
}

export const all = async (req, res, next) => {
    try {
        const products = await Product.find()
        res.status(200).json(products.map(product => normalizeProduct(product, req)))
    } catch (error) {
        res.status(400).json({ error })
    }
}

export const one = (req, res, next) => {
    Product.findOne({ _id: req.params.id })
        .then(product => res.status(200).json(normalizeProduct(product, req)))
        .catch(error => res.status(404).json({ error }))
}

export const suppr = async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params.id })
        if (product.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non autorisé' })
        }
        fs.unlinkSync(`images/${product.filename}`)
            const supprimer = await Product.deleteOne({ _id: req.params.id })
            if (!supprimer) {
                res.status(401).json({ error })
            }
            res.status(200).json({ message: 'Objet supprimé !' })
    } catch (error) {
        res.status(500).json({ error })
    }
}

export const modif = async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params.id })
        if (product.userId != req.auth.userId) {
            res.status(401).json({ message: 'Non autorisé' })
        }

        let productObject = null
        if (req.file) {
            productObject = {
                ...JSON.parse(req.body.sauce),
                filename: req.file.filename,
            }
            fs.unlinkSync(`images/${product.filename}`)
        } else { 
            productObject = { ...req.body }
        }
        delete productObject._userId

        const update = await Product.updateOne({ _id: req.params.id }, { ...productObject, _id: req.params.id })
        if (!update) {
            res.status(401).json({ error })
        }
        res.status(200).json({ message: 'Objet modifié !' })

    } catch (error) {
        res.status(400).json({ error })
    }
}

export const liked = async (req, res, next) => {
    try {
        const userLike = {
            ...JSON.parse(req.body.like),
            like: req.body.like,
            userId: req.body.userId,
        }

        if (userLike.like === 1) {
            const addLike = await Product.updateOne({ _id: req.params.id }, { $push: { usersLiked: userLike.userId } })
            if (addLike) {
                res.status(200).json({ message: 'You like !' })
            }
        }
        if (userLike.like === -1) {
            const addDislike = await Product.updateOne({ _id: req.params.id }, { $push: { usersDisliked: userLike.userId } })
            if (addDislike) {
                res.status(200).json({ message: 'You dislike !' })
            }
        }
        if (userLike.like === 0) {
            const removeLike = await Product.updateOne({ _id: req.params.id }, { $pull: { usersLiked: userLike.userId } })
            const removeDislike = await Product.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: userLike.userId } })
            if (removeLike || removeDislike) {
                res.status(200).json({ message: 'Tu n\as ni like ni dislike !' })
            }
        }
    } catch (error) {
        res.status(400).json({ error })
    }
}