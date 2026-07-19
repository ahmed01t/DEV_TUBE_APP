import { Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels } from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();
// user is subscribing channel and unsubscribing channel
// channelid is basically the user id of the channel owner because channel is basically a user who is uploading videos and the user who is subscribing to the channel is basically a user who is watching the videos of the channel owner
subscriptionRouter.post("/:channelId/toggle",verifyJWT,toggleSubscription);
subscriptionRouter.get("/:channelId/subscribers",verifyJWT,getUserChannelSubscribers);
subscriptionRouter.get("/:channelId/subscribed-channels",verifyJWT,getSubscribedChannels);
// user A is subscribing to user b that is channel with Auth token of user A 
export {subscriptionRouter};