import { Router} from "express";
import { getChannelVideos, getChannelStats } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const dashboardRouter = Router();
// user is subscribing channel and unsubscribing channel
// channelid is basically the user id of the channel owner because channel is basically a user who is uploading videos and the user who is subscribing to the channel is basically a user who is watching the videos of the channel owner
dashboardRouter.get("/:channelid/videos",verifyJWT,getChannelVideos);
dashboardRouter.get("/:channelid/stats",verifyJWT,getChannelStats);
export {dashboardRouter};