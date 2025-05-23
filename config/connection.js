const mongoose = require("mongoose");
require("dotenv").config();
const MONGO_DB = process.env.MONGO_DB;

async function startMongoServer(){
    try{
        await mongoose.connect(`${MONGO_DB}`);
        console.log("Mongo db connected successfully");
    }
    catch(err){
        console.log("Error in connecting to mongoDB");
    }
}

module.exports = startMongoServer;