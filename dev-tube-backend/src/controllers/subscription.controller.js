import mongoose from "mongoose";   
import { Schema } from "mongoose"; 
import { Comment } from "../models/comments.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";    
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription=asyncHandler(async(req,res)=>{
const {channelId}=req.params;
if(!mongoose.Types.ObjectId.isValid(channelId)){
    throw new ApiError(400,"Invalid channel id");
}
if(!channelId){
    throw new ApiError(400,"Channel id is required");
}
// if channel is subscribed by the user then unsubscribe it and if not subscribed then subscribe it
const subscription=await Subscription.findOne({subscriber:req.user?._id,channel:channelId});
if(subscription){
    await Subscription.findByIdAndDelete(subscription._id);
    return res.status(200).json(
        new ApiResponse(200,null,"Unsubscribed successfully")
    );
    // if not subscribed then subscribe it and show name who subscribed the channel and show name of the channel who is subscribed by the user

}
else{
    const newSubscription=await Subscription.create({subscriber:req.user?._id,channel:channelId});
    const populatedSubscription = await newSubscription.populate([
    { path: "subscriber", select: "fullname email" },
    { path: "channel", select: "fullname email" }
]);
    return res.status(200).json(
        new ApiResponse(200,populatedSubscription,"Subscribed successfully")
    );
}
})

const getUserChannelSubscribers=asyncHandler(async(req,res)=>{
    const {channelId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400,"Invalid channel id");
    }   
    if(!channelId){
        throw new ApiError(400,"Channel id is required");
    }// it matches the channel id with the channel id in the subscription model and then it populates the subscriber field with the user details of the subscriber because  subscriber is raw object id populate replace it with name and email of the subscriber and then it returns the subscribers of the channel
     const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber", "fullname username email avatar");
    //counting total subscribers of the channel
    const totalSubscribers=subscribers.length;
    return res.status(200).json(
        new ApiResponse(200,{subscribers,totalSubscribers},"Subscribers fetched successfully")
    );
    if(!subscribers){
        throw new ApiError(404,"No subscribers found");
    } 
})

const getSubscribedChannels=asyncHandler(async(req,res)=>{
    const subscribedChannels=await Subscription.find({subscriber:req.user?._id}).populate("channel","fullname username email avatar");
    //counting total subscribed channels of the user
    const totalSubscribedChannels=subscribedChannels.length;
    return res.status(200).json(
        new ApiResponse(200,{subscribedChannels,totalSubscribedChannels},"Subscribed channels fetched successfully")
    );
    if(!subscribedChannels){
        throw new ApiError(404,"No subscribed channels found");
    }
})

export {toggleSubscription,getUserChannelSubscribers,getSubscribedChannels};
