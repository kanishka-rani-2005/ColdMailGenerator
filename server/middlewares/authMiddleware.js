const jwt=require("jsonwebtoken")
const User=require("../models/User")


const protect=async (req,res,next)=>{

    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        // Cookie
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }

        if(!token){
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        req.user=await User.findById(decoded._id).select('-password')
        if(!req.user){
            return res.status(404).json({ message: 'User not found' });
        }
        next();
    }catch(err){
        return res.status(401).json({ message: 'Not authorized, token failed', error: err.message });
    }
}


module.exports={protect}