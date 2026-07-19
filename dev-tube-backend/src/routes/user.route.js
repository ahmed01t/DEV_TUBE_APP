import { Router } from "express";
import {
     getChannelProfile,
      getCurrentUser,
       getWatchHistory, 
       logoutUser, registerUser,
        updateAccountDetails,
         updateAvatar } from "../controllers/user.controller.js";
import { changeCurrentPassword } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { loginUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { refreshAccessToken } from "../controllers/user.controller.js";
const userRouter= Router();


userRouter.route("/register").post(
    // adding middleware(upload) for uploading images and avatar
    upload.fields([
        {
            name :"avatar",
            maxCount:3
        },
        {
            name :"coverImage",
            maxCount:3
        }
    ]),registerUser)

userRouter.route("/login").post(loginUser)

console.log("user routes loaded");
// secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/change-password").post(verifyJWT,changeCurrentPassword);
userRouter.route("/current-user").get(verifyJWT,getCurrentUser)
userRouter.route("/update-account").patch(verifyJWT,updateAccountDetails)
userRouter.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateAvatar)
userRouter.route("/channel/:username").get(verifyJWT,getChannelProfile)
userRouter.route("/watch-history").get(verifyJWT,getWatchHistory)
export default userRouter;