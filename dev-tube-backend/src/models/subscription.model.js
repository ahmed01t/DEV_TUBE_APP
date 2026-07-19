import mongoose from "mongoose";
import { Schema } from "mongoose";

const subscriptionSchema= new Schema({
// this schema is all abou one subscriber is subscribing to which channel and one channel is having many subscribers
    subscriber:{
        type:Schema.Types.ObjectId, // one who is Subscribing
        ref :"User"
    },
        // one who the user is subscribing 
    channel:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Subscription=mongoose.model("Subscription",subscriptionSchema);
