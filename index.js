const express = require('express');
const app =  express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
//IMPORT ROUTES
const authRoute = require('./routes/auth');

dotenv.config();


// DB connection 
mongoose.connect(process.env.DB_CONNECTION, {useUnifiedTopology: true, useNewUrlParser: true},()=>{
    console.log('DB Connected');
});

//Middleware
app.use(express.json());



// Route Middlewares
app.use('/api/user', authRoute); //This middleware will add prefix in auth route



app.listen(3000,()=>{
    console.log("Server running successfully");
})