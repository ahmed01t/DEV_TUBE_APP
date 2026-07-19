// import mongoose from "mongoose";
// import { db_name } from "./constants";
// import express from "express";


import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT||4000,()=>{
        console.log(`server is runnning on porttt :${process.env.PORT}`);
    }) 
})
.catch((error)=>{
    console.log("mongodb connection failed",error);
})

app.get("/test", (req, res) => {
  res.send("server is working");
});



// const app=express();

// // iifi immediately execute function
// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${db_name}`)
//         app.on("error",(error)=>{
//                 console.log("ERROR ",error);
//                 throw error
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`app is listening on port ${process.env.PORT}`);
//     })

//     } catch (error) {
//         console.error("error",error);
//         throw error
//     }


// })() 