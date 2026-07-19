import mongoose from "mongoose";      
import { Schema } from "mongoose";
import { Comment } from "../models/comments.model.js";
import { ApiError } from "../utils/ApiErrors.js";   
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

//populate() in Mongoose means: replace an ObjectId reference with the actual document data from another collection.

const getVideoComments = asyncHandler(async (req, res) => {
    // getting all comments for a  single video
    const { videoId } = req.params;
    if(!videoId){
        throw new ApiError(400, "Video ID is required");
    }
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }
    const video= await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    // finding comments for the  single video in database       // comment does not store the whole user object it is just storing user id so we need to populate the user object to get the user details // replace that userID with real user object and get the username and email of the user who commented on the video
    const comments = await Comment.find({ video: videoId }).populate("owner", "username email");
        if(comments.length===0){
            return res.status(200).json(
                new ApiResponse(200, [], "No comments found for this video")
            );
        }
            
    // showing comments on screen
    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    );
if(!comments){
        throw new ApiError(404, "No comments found for this video");
    }


})

const addCommentToVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body; // content is actually the comment text that user is writing on the video
    if(!videoId || !content){
        throw new ApiError(400, "Video ID and content are required");
    }
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid video ID");
    }
    const  video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    // Create a new comment
    const comments = await Comment.create({
        video: videoId,
        owner: req.user?._id, // Assuming the user is authenticated and their ID is available in req.user
        content: content
    });

    return res.status(201).json(
        new ApiResponse(201, comments, "Comment added successfully")
    );
})

const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    if(!commentId || !content){
        throw new ApiError(400, "Comment ID and content are required");
    }
    const comment = await Comment.findByIdAndUpdate(
        commentId,
        { content: content },
        { new: true }
    );
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }
    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if(!commentId){
        throw new ApiError(400, "Comment ID is required");
    }
    const comment = await Comment.findByIdAndDelete(commentId);
    if(!comment){
        throw new ApiError(404, "Comment not found");
    }
    return res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    );
})

export { getVideoComments, addCommentToVideo, updateComment, deleteComment };