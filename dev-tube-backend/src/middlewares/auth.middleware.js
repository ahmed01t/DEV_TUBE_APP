// creating our own authentication middleware

//This middleware is used to check whether the user is logged in before allowing access to a protected route.
// get the token from cookie or header
// verify that token
// find the user from the database
// attach that user to req
// let the request continue
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
// this middleware is used to verify that user is logged in already
export const  verifyJWT=asyncHandler(async(req,res,next)=>{
  try {
      const token=req.cookies?.accessToken || req.header
      ("Authorization")?.replace("Bearer ","")
      if(!token){
          throw new ApiError(401,"Unauthorized request");
      }
  
      const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
  
      const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
  
      if(!user){
          throw new ApiError(401,"Invalid Access Token : Please Login to access this resource");
      }
  
      req.user=user;
      next()
  } catch (error) {
    throw new ApiError(401,error?.message||"Invalid access token")
    
  }
})