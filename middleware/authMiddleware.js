import jwt from 'jsonwebtoken'

export const authUser = async (req, res, next) =>{
    try{
        const token = req.cookies.token || req.header.Authorization.split(' ' [1]);

        if(!token){
            return res.status(401).send({error : 'unautherized User'})
        }

        const decoded = jwt.verify(token, process.env.JWR_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        res.status(401).send({error : 'please authenticate!'})
    }
}