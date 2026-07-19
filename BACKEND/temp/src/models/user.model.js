import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
         email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },
         fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String, /// we will use cloudnary for storing this third party service
            required:true
        },
        coverImage:{
            type:String,
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,'password is required']
        },
        refreshToken:{
            type:String
        }




},{timestamps:true})





// pre hook used for authentication (pre hook it will run before any data saved in database)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// methods and hooks on schema ..
//. You are attaching it to your Mongoose schema, and Mongoose makes it available on every document (user instance).
// custom build method for all users..
userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)// comparing hashed password stored in database with user entered passwprd
}




// tokens 
//(.sign) Create a JWT (JSON Web Token) using some data (payload), sign it with a secret key, and return the token as a string.
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id: this._id,
            email :this.email,
            username :this.username,
            fullname:this.fullname
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
                }
    )
}
userSchema.methods.generateRefreshToken=function(){
     return jwt.sign(
        {
            _id: this._id,
            email :this.email,
            username :this.username,
            fullname:this.fullname
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
                }
    )
}

export const User=mongoose.model("User",userSchema)
