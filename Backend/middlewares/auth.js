const jwt=require('jsonwebtoken');
const User=require('../models/User');


const auth=async(req,res,next)=>{
    try{
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('unauthorized');
        }
        const token = authHeader.replace('Bearer ','');
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await User.findOne({_id:decoded._id});
        if(!user){
            throw new Error('Authentication failed');
        }
        req.user=user;
        req.token=token;
        next();
    }catch(error){
        res.status(401).send({error: error.message});

    }
}
module.exports=auth;