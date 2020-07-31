const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { registerValidation,loginValidation } = require('../validation');

//User Creation
router.post('/register', async (req,res)=>{
    // Lets validate the data before create new user
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    // Checking if the use is already in the database
    const emailExist = await User.findOne({email: req.body.email });
    if(emailExist) return res.status(400).send('Email already exists');
    
    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword =  await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    
    try{
        const savedUser = await user.save();
        res.send(user._id);
    }catch(err){
        res.status(400).send(err);
    }

});

// LOGIN
router.post('/login', async (req,res) =>{
    // Lets validate the data before create new user
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if the use is already in the database
    const user = await User.findOne({email: req.body.email });
    if(!user) return res.status(400).send("Email not found");

    //IF PASSAWORD IS CORRECT
    const validPass =  await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid password")

    //Create and assign token
    const token =  jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
})







module.exports = router;