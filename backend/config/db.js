const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("datbase connect succesfully")
    }catch(err){
        console.log(err.message);
        process.exit(1);
        
    }
};


module.exports=connectDB;