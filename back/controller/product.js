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
        const normalize = normalizeProduct(product, req)
        const filename = normalize.imageUrl.split('/images/')[1]
        fs.unlink(`images/${filename}`, async () => {
            const supprimer = await Product.deleteOne({ _id: req.params.id })
            if (!supprimer) {
                res.status(401).json({ error })
            }
            res.status(200).json({ message: 'Objet supprimé !' })
        })
    } catch (error) {
        res.status(500).json({ error })
    }
}

export const modif = (req, res, next) => {
    Product.updateOne()
}