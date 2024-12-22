const UserModel = require('../Models/UserModel')
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');


const createtoken = (_id) =>{
    const jwtkey = process.env.JWT_KEY;
    return jwt.sign({_id}, jwtkey);
}
const RegisterUser = async(req, res)=>{
    try{
        const {name, email, password} = req.body;
        let User = await UserModel.findOne({email});

        if(User) return res.status(400).json('Utilisateur avec cet email existe deja');

        if(!name || !email || !password) return res.status(400).json('tous les champs sont requis');

        if(!validator.isEmail(email)) return res.status(400).json('email est incorrecte');

        if(!validator.isStrongPassword(password)) return res.status(400).json('Le mot de passe doit comporter au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.');

        // creation d'un utilisateur
        User = UserModel({name, email, password});

        const salt = await bcrypt.genSalt(10);
        User.password = await bcrypt.hash(User.password, salt);

        await User.save();

        const token = createtoken(User._id);

        res.status(200).json({id: User._id, name, email, token});
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
    
};
const LoginUser = async(req, res)=>{
    const {email, password} = req.body;
    try{
        let User = await UserModel.findOne({email});

        if(!User) return res.status(400).json("email ou mot de passe invalid");

        const isValidPassword = await bcrypt.compare(password, User.password);

        if(!isValidPassword) return res.status(400).json("mot de passe incorrect");

        const token = createtoken(User._id);

        res.status(200).json({id: User._id, name: User.name, email, token});
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}
const FindUser = async(req, res)=>{
    const UserId = req.params.UserId;
    try{
        const User = await UserModel.findById(UserId);
        res.status(200).json(User);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}
const GetUser = async(req, res)=>{
    try{
        const Users = await UserModel.find();
        res.status(200).json(Users);
    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}
module.exports = {RegisterUser, LoginUser, FindUser, GetUser} ;