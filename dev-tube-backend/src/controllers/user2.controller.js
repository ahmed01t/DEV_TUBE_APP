// import { asyncHandler } from "../utils/asynchandler.js";
// import { APIError } from "../utils/ApiErrors.js";
// import { User } from "../models/user.model.js";
// import { uploadonCloudinary } from "../utils/cloudinary.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import jwt from "jsonwebtoken";   
// import { Subscription } from "../models/subscription.model.js";
// import mongoose from "mongoose";
// //GENERATING ACCESS TOKEN AND REFRESH TOKEN
// const generateAccessandRefreshToken=async(userId)=>{
//     try {
//         const user=await User.findById(userId);
//         const accessToken=user.generateAccessToken();
//         const refreshToken=user.generateRefreshToken();
        
//         // saving refresh token in database
//         //first giving to user
//         user.refreshToken=refreshToken
//         await user.save({validateBeforeSave:false})// validateBeforeSave means dont check all validations again we have set in Usermodel because it is un-necessary work

//         return {accessToken,refreshToken}
//     } catch (error) {
//         throw new APIError(500,"Something went wrong while generating tokens")
//     }
// }


// const registerUser=asyncHandler(async(req,res)=>{
// // how to register user?
// //1- get user details from frontend
// //2-validation if fields are empty constraints are followed or not?
// //3-check if user already exist or not(from username or email)
// //4- check for images  and avatar(upload them on cloudinary)
// // check if avatar is uploaded on cloudinary or not
// // create user object -
// //remove password and refresh token field from response
// // check for user creation(return response)

// // STEP-1(get user details from frontend)
// const {fullname,username,email,password}=req.body
// console.log("email: ",email);

// if ([fullname,email,username,password].some((field)=>field?.trim()==="")
// ) {
//     throw new APIError(400,"All fields are required")
// }
// // database is in another continent always use await to talk to it
// const existedUser= await User.findOne({
//     $or:[{username} , {email}]
// })

// if(existedUser){
//     throw new APIError(409,"User with email or username already existed");
// }
// console.log("req.files:", req.files);
// console.log("req.body:", req.body);

// // multer is taking files from user and uploading it on local sever
// //const avatarLocalPath=req.files?.avatar[0]?.path;
// let avatarLocalPath;
// if(req.files&&Array.isArray(req.files.avatar)&& req.files.avatar.length>0){
//     avatarLocalPath=req.files.avatar[0].path;
// }

// console.log(avatarLocalPath);  
// //may cause error this syntax we need to check with  another method 
// //const coverImageLocalpath=req.files?.coverimage[0]?.path;
// let coverImageLocalpath;
// if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0){
//     coverImageLocalpath=req.files.coverimage[0].path;

// }

// if(!avatarLocalPath){
//     throw new APIError(400,"Avatar file is required");
// }
// const avatar=await uploadonCloudinary(avatarLocalPath);
// console.log("Avatar:", avatar);
// const coverimage=await uploadonCloudinary(coverImageLocalpath);
// if(!avatar){
//     throw new APIError(400,"avatar is not uploaded");
// }

// const user=await User.create({
//     fullname,
//     avatar:avatar.url,
//     coverimage:coverimage?.url||"",
//     email,
//     password,
//     username:username.toLowerCase()
// })
// /// finding if user is created or not
//  const createdUser=await User.findById(user._id).select(
//     "-password -refreshtoken"
//  )

//  if(!createdUser){
//     throw new APIError(500,"Something went wrong in registering user");
//  }
//   return res.status(201).json( new ApiResponse(200,createdUser,"user registered successfully")
//  )
// })

// const loginUser=asyncHandler(async(req,res)=>{
//     //req body->database
//     //username or email
//     // find the user
//     // password check
//     //access and refresh token
//     // send secure cookie

//     const {email,username,password}=req.body;
//     if(!(username || !email)){
//         throw new APIError(400,"username or email is required")
//     }
//     // finding in database 
//    const user=await User.findOne({
//     $or:[{username},{email}]
//    })
//    //  no user existed
//    if(!user){
//     throw new APIError(404,"User does not exists");
//    }
//    // checking password is correct or not?
//    const isPasswordValid=await user.isPasswordCorrect(password)
//    if(!isPasswordValid){
//     throw new APIError(404,"Password is not Correct");
//    }


//     const {accessToken,refreshToken}=await generateAccessandRefreshToken(user._id);
// // we dont want to send some unwanted fields  because refresh token and password may steal
//     const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
//     //sending cookie why sending secure bacuse by default cookie is modifiable by frontend by setting it secure:true (it is only modifiable through server) 
//     const options={
//         httpOnly:true,
//         secure:true
//     }

//     // sending token to clients as cookies..
//     return res
//     .status(200)
//     .cookie("accessToken",accessToken,options)
//     .cookie("refreshToken",refreshToken,options)
//     .json(
//         new ApiResponse(
//             200,
//             {
//                 user:loggedInUser,accessToken,refreshToken
//             },
//             "USer logged in Successfully"
//         )
//     )


// })

// const logoutUser=asyncHandler(async(req,res)=>{
// // this is a secure route we have created whenever a user reaches here he has refresh token and login 
// // that is why we have req.user here generateAccessandRefreshToken

// await User.findByIdAndUpdate(
//     req.user._id,
//     {
//         $unset:{refreshToken:1}
//     },
//     { new:true}
// )
// const options={
//     httpOnly:true,
//     secure:true
// }
// return res
// .status(200)
// .clearCookie("accessToken",options)
// .clearCookie("refreshToken",options)
// .json(new ApiResponse(200,{},"user logged out"))
// })

// //refreshing access token user will hit a endpoint from frontend 
// const refreshAccessToken = asyncHandler(async (req, res) => {
//     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
// console.log("cookies:", req.cookies);
//     if (!incomingRefreshToken) {
//         throw new APIError(401, "Unauthorized request");
//     }

//     try {
//         const decodedToken = jwt.verify(
//             incomingRefreshToken,
//             process.env.REFRESH_TOKEN_SECRET
//         );

//         const user = await User.findById(decodedToken?._id);
//         if (!user) {
//             throw new APIError(401, "Invalid refresh token");
//         }

//         if (incomingRefreshToken !== user.refreshToken) {
//             throw new APIError(401, "Refresh token is expired or used");
//         }

//         const options = {
//             httpOnly: true,
//             secure: true
//         };

//         const { accessToken, refreshToken } = await generateAccessandRefreshToken(user._id);
//             return res
//             .status(200)
//             .cookie("accessToken", accessToken, options)
//             .cookie("refreshToken", refreshToken, options)
//             .json(
//                 new ApiResponse(
//                     200,
//                     { accessToken, refreshToken },
//                     "Access token refreshed"
//                 )
//             );
//     } catch (error) {
//         throw new APIError(401, error?.message || "Invalid refresh token");
//     }
// });

// const changeCurrentPassword=asyncHandler(async(req,res)=>{
//     const {oldPassword,newPassword,ConfirmPassword}=req.body
//  //"Go to the User collection and find the user whose _id is this."
//  if(!(newPassword===ConfirmPassword)){
//     throw new APIError(200,"new password and confirm password not matched");
//  }
//     const user=await User.findById(req.user?._id)

//     const oldPasswordCorrect=await user.isPasswordCorrect(oldPassword);
//     if(!oldPasswordCorrect){
//         throw  new APIError(400,"invalid old password");
//     }
//     user.password=newPassword;
//     await user.save({validateBeforeSave:false})

//     return res
//     .status(200)
//     .json(new ApiResponse(200,{},"Password changes successfully"));


// })
// //////////////why using the async inside asynchandler (because we also need to add await inside function at particular fields)..
// const getCurrentUser=asyncHandler(async(req,res)=>{
//     return res
//     .status(200)
//     .json(200,req.user,"Current user fetched successfully");// because user is already logged in 
// })

// const updateAccountDetails=asyncHandler(async(req,res)=>{
//     //extracting fullname and email from frontend
//     const{fullname,email}=req.body
//     if(!fullname || !email){
//         throw new APIError(400,"All fields are required");
//     }
//     User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set:{
//                 fullname:fullname,
//                 email:email
//             }
//         },
//         {new :true}
//     ).select("-password")
//     return res
//     .status(200)
//     .json(new ApiResponse(200,user,"Account details updated successfully"))
// })

// const updateAvatar=asyncHandler(async(req,res)=>{
//     const avatarLocalPath=req.file?.path
//     if(!avatarLocalPath){
//         throw new APIError(400,"Avatar file is missing")
//     }

//     const avatar=await uploadonCloudinary(avatarLocalPath)
//     if(!avatar.url){
//         throw new APIError(400,"error while uploading avatar while updating");
//     }

//     await User.findByIdAndUpdate(
//         req.user?._id,
//         {
//             $set:{avatar:avatar.url}
//         },
//         {new:true}
//     ).select("-password")

// })

// const getChannelProfile=asyncHandler(async(req,res)=>{
//     const {username}=req.params
//     if(!username?.trim()){
//         throw new APIError(400,"Username is missing")
//     }
//     const channel=await User.aggregate([
//         {
//             $match:{username:username?.toLowerCase()}
//         },
//         {
//               $lookup:{
//                 from:"subscriptions",
//                 localField:"_id",//take the _id value from the current user document that is already flowing through the aggregation pipeline.
//                 foreignField:"channel",
//                 as:"subscribers" 
//               }
//         },
//         //subscriber field means user is following which channels 
//         {
//             $lookup:{
//                 from:"subscriptions",
//                 localField:"_id",
//                 foreignField:"subscriber",
//                 as:"subscribe_to" 
//               }   
//         },
//         {
//             $addFields:{
//                 subscribersCount:{
//                     $size:"subscribers"
//                 },
//                 channelSubscribedto:{
//                     $size:"subscribe_to"
//                 },
//                 isSubscribed:{
//                     $cond:{
//                         if:{$in:[req.user?._id,"$subscribers.subscriber"]},
//                         then:true,
//                         else:false
//                     }
//                 }
//             }

//         },
//         {
//             $project:{
//                 fullname:1,
//                 username:1,
//                 subscribersCount:1,
//                 channelSubscribedto:1,
//                 isSubscribed:1,
//                 avatar:1,
//                 coverimage:1,
//                 email:1
//             }
//         }
//     ])   
//     if(!channel?.length){
//         throw new APIError(404,"Channel Does not Exists")
//     }  
//     return res
//     .status(200)
//     .json(
//         new ApiResponse(200,channel[0],"User channel fetched Successfully")
//     )
// })
// const getWatchHistory=asyncHandler(async(req,res)=>{
//     const user=await User.aggregate([
//         {
//            $match:{
//             _id:new mongoose.Types.ObjectId(req.user._id)
//            } 
//         },
//         {// joining to finding users watch watchHistory
//             $lookup:{
//                 from:"videos",
//                 localField:"watchHistory",
//                 foreignField:"_id",
//                 as:"watchHistory",
//                 pipeline:[
//                     {
//                         $lookup:{
//                             from:"users",
//                             localField:"owner",
//                             foreignField:"_id",
//                             as:"owner",
//                             pipeline:[
//                                 {
//                                     $project:{
//                                         fullName:1,
//                                         username:1,
//                                         avatar:1
//                                     }
//                                 }
//                             ]
//                         }
//                     }
//                 ]
//             }
//         },
//         {
//             $addFields:{
//                 owner:{
//                     $first:"$owner"
//                 }
//             }
//         }

//     ])
//     return res
//     .status(200)
//     .json(
//         new ApiResponse(
//             200,user[0].watchHistory,
//             "watch history fetched successfully"
//         )
//     )
// })

// export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,getWatchHistory,updateAvatar,getChannelProfile};