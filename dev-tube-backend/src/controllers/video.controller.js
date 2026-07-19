import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";  
import {ApiError} from "../utils/ApiErrors.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const publishVideo=asyncHandler(async(req,res)=>{
//  getvideo,upload video to cloudinary, save video details in database,create a new video document in the database, and return a success response with the video details.
const {title,description}=req.body;
if(!title.trim() || !description.trim()){
    throw new ApiError(400,"Title and description are required");}

    const thumbnaiLocalPath=req.files?.thumbnail?.[0]?.path;
    if(!thumbnaiLocalPath){
        throw new ApiError(400,"Thumbnail file is required");
    }  
    const thumbnailUploadResponse=await uploadOnCloudinary(thumbnaiLocalPath,"image");
    if(!thumbnailUploadResponse){
        throw new ApiError(500,"Failed to upload thumbnail");
    }
    const videoLocalPath=req.files?.video?.[0]?.path;
    if(!videoLocalPath){
        throw new ApiError(400,"Video file is required");
    }
    const videoUploadResponse=await uploadOnCloudinary(videoLocalPath,"video");
    if (!videoUploadResponse?.secure_url || !videoUploadResponse?.public_id) {
    throw new ApiError(500, "Failed to upload video");
}
    const videoUrl=videoUploadResponse.secure_url;
    const videoPublicId=videoUploadResponse.public_id;

    const video=await Video.create({
        videofile:videoUrl,
        duration:videoUploadResponse.duration,
        title,
        description,
        thumbnail:thumbnailUploadResponse.secure_url,
        owner:req.user?._id,
        
    });
    const publishedVideo=await video.save();    
    if(!publishedVideo){
        throw new ApiError(500,"Failed to publish video");
    }
    return res.status(201).json(
        new ApiResponse(201, publishedVideo, "Video published successfully")
    );
});

const getVideoById=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    // It does not check whether a video with that ID exists in your database. It only checks whether the string you passed could theoretically be a valid MongoDB ObjectId — meaning it's a 24-character hexadecimal string in the correct format.
if(!mongoose.Types.ObjectId.isValid(videoId)){
    throw new ApiError(400,"Invalid video id");}
const video=await Video.findById(videoId);
if(!video){
    throw new ApiError(404,"Video not found");}

// Keep a most-recent-first watch history for the authenticated viewer.
const viewer = await User.findById(req.user?._id);
if (viewer) {
    viewer.watchHistory = [
        video._id,
        ...viewer.watchHistory.filter((watchedVideoId) => !watchedVideoId.equals(video._id))
    ];
    await viewer.save({ validateBeforeSave: false });
}

return res.status(200).json(
    new ApiResponse(200,video,"Video fetched successfully")
);
})

const getAllVideos=asyncHandler(async(req,res)=>{
    const{page=1,limit=10,query,sortBy,sortType,userId}=req.query;
    const filter={isPublished:true};
 // matching the title or description with the query string, case-insensitive
    if(query){
        filter.$or=[
            {title:{$regex:query,$options:"i"}},
            {description:{$regex:query,$options:"i"}}
        ]
    }
    if(userId){
        if(!mongoose.Types.ObjectId.isValid(userId)){
            throw new ApiError(400,"Invalid user id");
        }
        filter.owner=userId;
    }
    const sort={};
    if(sortBy){
    sort[sortBy]=sortType==="desc" ? -1 : 1;
    }
    else{// if no sort given default showing latest videos first
        sort.createdAt=-1;
    }
    const pageNumber=Number(page);
    const limitNumber=Number(limit);
    //tells MongoDB how many documents to skip over before starting to collect results.

    const skip=(pageNumber-1)*limitNumber;
    // actual query to fetch videos from the database based on the filter, sort, skip, and limit parameters.
    const videos=await Video.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limitNumber)
    // counting all the videos so the frontend can know how many pages are there in total based on the limit
    const totalVideos=await Video.countDocuments(filter);
    return res.status(200).json(
        new ApiResponse(200,{videos,totalVideos,page:pageNumber,limit:limitNumber},"Videos fetched successfully")
    );
});

const updateVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid video id");
    }
    if(!videoId){
        throw new ApiError(400,"Video id is required");
    }
    // sending title and description  to update video in database
    const {title,description}=req.body;
    if(!title?.trim() || !description?.trim()){
        throw new ApiError(400,"Title and description are required for updating video");
    }
    // finding video in database and updating it
    const updatedVideo=await Video.findByIdAndUpdate(
        req?.params?.videoId,
        {
            $set:{
                title:title.trim(),
                description:description.trim()
            }
        },
        {new:true,runValidators:true
        }
    )

    
    if(!updatedVideo){
        throw new ApiError(404,"Video not found");
    }
    return res.status(200).json(
        new ApiResponse(200,updatedVideo,"Video updated successfully")
    );
})

const deleteVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid video id");
    }
    if(!videoId){
        throw new ApiError(400,"Video id is required");
    }
    const deletedVideo=await Video.findByIdAndDelete(req.params.videoId);
    if(!deletedVideo){
        throw new ApiError(404,"Video not found");
    }
    return res.status(200).json(
        new ApiResponse(200,deletedVideo,"Video deleted successfully")
    );
})



export {publishVideo,getVideoById,getAllVideos,updateVideo,deleteVideo};
