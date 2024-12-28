import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const MONGO_URI = process.env.MONGO_URI;


//db connection
function connect(){
    mongoose.connect(MONGO_URI)
    .then(()=>{
        console.log(`connected to database!!`);
    })
    .catch((err)=>{
        console.log(err, `Cant not connected to the database!!`);
        
    })
}

export default connect;