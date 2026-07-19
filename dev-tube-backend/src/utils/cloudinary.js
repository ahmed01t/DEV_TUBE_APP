
// there are 2 ways of uploading file in backend
// 1st way we use multer which takes image file from users browser and uploads it on our server  from our server cloudinary takes and upload it own its server
//2nd way     multer does not upload on cloudinary it only takes file from browser 

import {v2 as cloudinary} from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        // upload file on cloudinary.
        const response=await cloudinary.uploader.upload
        (localFilePath,{
            resource_type:"auto"
        })
        // file has uploaded successfully
        console.log("file is uploaded on cloudinary",response.url);
        fs.unlinkSync(localFilePath)// fs.unlink neeeds two things path and callback 
        return response;


    } catch (error) {
      fs.unlinkSync(localFilePath) // remove the locally saved temporary file asthe upload operation got failed
      return null;  
    }
}


export {uploadOnCloudinary};
