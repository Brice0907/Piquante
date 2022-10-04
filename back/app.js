import Express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Authroute from "./route/auth.js";
import Productroute from "./route/product.js";
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

mongoose.connect('mongodb+srv://worms:Worms0907@cluster0.0jot8uh.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = Express()

app.use(cors())
app.use(Express.json())

app.use('/api/auth', Authroute)
app.use('/api/sauces', Productroute)
app.use('/images', Express.static(path.join(__dirname, 'images')))

export default app