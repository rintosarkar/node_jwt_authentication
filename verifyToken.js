const jwt = require('jsonwebtoken');

function auth(req,res,next){
    const token = req.header('auth-token');
    if(!token)return res.status(401).send('Acced denied');
    try{
        const verified = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verified;
    }catch(err){
        res.status(400).send('Invalid token here')
    }
}