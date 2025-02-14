import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {
     try {
         const user = await User.findOne(userId)      
         const accessToken = user.generateAccessToken()
         const refreshToken = user.generateRefreshToken()

         user.refreshToken = refreshToken
         await user.save({ validateBeforeSave:false });

         return { accessToken,refreshToken }
         
     } catch (error) {
      throw new ApiError(500,"Something went wrong while generating access and refresh token")
     }
}

const registerUser = asyncHandler( async(req,res) => {
    //Steps:-
   //get user details from frontened
   //validation : check is there any field empty
   //check if user already exits:- can check using email,username
   //check for images,check for avatar(because it required mention in the model)
   //upload them on the cloudinary,avatar
   //create user object-create entry in db
   //remove password and refresh token field with response
   // check for user creation
   //return response

   
   const {fullName,username,email,password} = req.body
   // console.log("Email:",email);

//  validation
   if(fullName ===""){
      throw new ApiError(400,"Fullname field is required");
   }
   else if(username ===""){
    throw new ApiError(400,"username field is required");
   }
   else if(password ===""){
    throw new ApiError(400,"password field is required");
   }
 
   const existedUser = await User.findOne({
    $or:[{ username },{ email }]
   })
    
   if(existedUser){
    throw new ApiError(409,"User with email or username already exists");
   }
   // console.log(req.files);

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImageLocalPath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath){
    throw new ApiError(400,"Avatar Image is required");
   }
   
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   const coverImage = await uploadOnCloudinary(coverImageLocalPath);

   if(!avatar){
    throw new ApiError(400,"Avatar File is required");
   }

   const user = await User.create({
     fullName,
     avatar:avatar.url,
     coverImage:coverImage?.url || "",
     email,
     password,
     username:username.toLowerCase()
   })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user");
   }
   
   return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
   )
})

const loginUser = asyncHandler( async (req,res,next)=>{
   //steps:-
   //take data from req.body
   //username or email
   //find the user
   //password check
   //access and refresh token
   //send cookies

   const { email,username,password } =  req.body

   if(!username && !email){
      throw new ApiError(400,"username or email is required")
   }

   const user = await User.findOne({
      $or:[{username},{email}]
   })
   
   if(!user){
      throw new ApiError(404,"User does not exist");
   }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid){
      throw new ApiError(401,"Password is incorrect");
   }

    const { accessToken,refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = User.findById(user._id).select("-password -refreshToken")

    const options = {
      httpOnly:true,                 //modified only by server
      secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
      new ApiResponse(
         200,
         {
            user:loggedInUser,accessToken,refreshToken
         },
         "User logged in successfully"
      )
    )
})

const logoutUser = asyncHandler ( async(req,res,next) => {
      await User.findByIdAndUpdate(
         req.user._id,
         {
            $set:{
               refreshToken:undefined
            }
         },
         {
            new: true
         }
      )

      const options = {
         httpOnly:true,             
         secure:true
       }

       return res
       .status(200)
       .clearCookie("access Token",options)
       .json(new ApiResponse(200,{},"User logged out"))
})

const refreshAccessToken  = asyncHandler((req,res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
      throw new ApiError(401,"unauthorized request");
   }
})


export { registerUser,loginUser,logoutUser }