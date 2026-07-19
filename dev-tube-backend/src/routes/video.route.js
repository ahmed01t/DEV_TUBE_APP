import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";     
import { upload } from "../middlewares/multer.middleware.js";
import { publishVideo } from "../controllers/video.controller.js";
import { ApiError } from "../utils/ApiErrors.js";
import { getVideoById } from "../controllers/video.controller.js";
import { getAllVideos } from "../controllers/video.controller.js";
import { updateVideo } from "../controllers/video.controller.js"; 
import { deleteVideo } from "../controllers/video.controller.js";
import { getVideoComments } from "../controllers/comments.controller.js";
import { addCommentToVideo } from "../controllers/comments.controller.js";
import { updateComment } from "../controllers/comments.controller.js";
import { deleteComment } from "../controllers/comments.controller.js";
const videoRouter = Router();

videoRouter.route("/upload-video").post(
        verifyJWT,
    upload.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    publishVideo
);
videoRouter.route("/all-videos").get(verifyJWT, getAllVideos);
videoRouter.route("/update-video/:videoId").patch(verifyJWT, updateVideo);
videoRouter.route("/delete-video/:videoId").delete(verifyJWT, deleteVideo);
videoRouter.route("/:videoId/comments").get(verifyJWT, getVideoComments);
videoRouter.route("/:videoId/add-comments").post(verifyJWT, addCommentToVideo);
videoRouter.route("/:videoId/update-comments/:commentId").patch(verifyJWT, updateComment);
videoRouter.route("/:videoId/delete-comments/:commentId").delete(verifyJWT, deleteComment);

videoRouter.get("/test-video", (req, res) => res.send("Video router works"));
videoRouter.route("/:videoId").get(verifyJWT, getVideoById);




 export default videoRouter;
