const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const UserRoute = require("./Routes/UserRoute")

require("dotenv").config();

app.use(express.json())
app.use(cors());
app.use('/api/User', UserRoute);

const uri = process.env.ATLAS_URI;

app.get('/', (req, res)=>{
    res.send('Bienvenue sur la page accueil');
})

app.listen(3000, (req, res)=>{
    console.log("serveur en ecoute sur le port 3000");
})

mongoose.connect(uri)
.then(()=> console.log("connection a mongoDB etablie"))
.catch((error)=> console.log("echec de connection  a mongoDB " , error.message ))