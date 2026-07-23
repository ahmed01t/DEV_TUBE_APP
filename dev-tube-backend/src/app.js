import express from "express";
import cors  from "cors";

// from my sever access and set cookies of user browser...
import cookieparser from "cookie-parser";
const app= express();

/// middlewares used for configuration   (app.use )
function getAllowedOrigins() {
    return (process.env.CORS_ORIGIN || "http://localhost:3000")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
}

app.use(cors({
    origin(origin, callback) {
        // Requests without an Origin header (for example curl or server-to-server
        // requests) are not browser CORS requests and can proceed normally.
        if (!origin || getAllowedOrigins().includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true
}));

// accepts data from user in json formmat with limit 16kb to prevent server from not crashing.
app.use(express.json({limit :"16kb"}))


//(request data) accepts data from url because url data is of many types and lets express understand data.
app.use(express.urlencoded({extended:true,limit:"16kb"}))

//public assets keep like pdf or any data keeps on my server and 
app.use(express.static("public"))

app.use(cookieparser())



// routes
import userRouter from "./routes/user.route.js";
import videoRouter from "./routes/video.route.js";
import {dashboardRouter} from "./routes/dashboard.route.js";
import { subscriptionRouter } from "./routes/subscription.route.js";
app.get("/test", (req, res) => {
  res.send("server is working");
});
// routes declearation
app.use("/api/v1/users",userRouter)
app.use("/api/v1/videos",videoRouter);
app.use("/api/v1/subscription",subscriptionRouter);
app.use("/api/v1/dashboard",dashboardRouter);

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: error.message || "Internal server error",
        errors: error.errors || []
    });
});

export {app};



