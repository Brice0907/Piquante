import Express from "express";
import mongoose from "mongoose";

mongoose.connect('mongodb+srv://worms:Worms0907@cluster0.0jot8uh.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = Express()

app.use('/test', (req, res) => {
    res.send("du nouveau texte")
})

export default app