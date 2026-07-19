import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {Subscription} from "../models/subscription.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiErrors.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const {channelid} = req.params;
    if(!mongoose.Types.ObjectId.isValid(channelid)){
        throw new ApiError(400,"Invalid channel id");
    }
    if(!channelid){
        throw new ApiError(400,"Channel id is required");
    }
    // finding if channel exists or not
    const channelExists = await User.exists({_id:channelid});
    if(!channelExists){
        throw new ApiError(404,"Channel not found");
    }   
    if(channelExists){
        const totalVideos = await Video.countDocuments({owner:channelid});
        const totalSubscribers = await Subscription.countDocuments({channel:channelid});
        //const totalLikes = await Like.countDocuments({video:{$in:await Video.find({owner:channelid}).select("_id")}});
        const totalViews = await Video.aggregate([
            {$match:{owner:new mongoose.Types.ObjectId(channelid)}},
            {$group:{_id:null,totalViews:{$sum:"$views"}}}
        ]);
        return res.status(200).json(
            new ApiResponse(200,{totalVideos,totalSubscribers,totalViews:totalViews[0]?.totalViews || 0},"Channel stats fetched successfully")
        );
    }
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {channelid} = req.params;
    if(!mongoose.Types.ObjectId.isValid(channelid)){
        throw new ApiError(400,"Invalid channel id");
    }
    if(!channelid){
        throw new ApiError(400,"Channel id is required");
    }
    // finding if channel exists or not
    const channelExists = await User.exists({_id:channelid});
    if(!channelExists){
        throw new ApiError(404,"Channel not found");
    }
    // finding all the videos uploaded by the channel
    const videos = await Video.find({owner:channelid}).sort({createdAt:-1});
    return res.status(200).json(
        new ApiResponse(200,{videos},"Channel videos fetched successfully")
    );

})

export {
    getChannelStats, 
    getChannelVideos
    }
