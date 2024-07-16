import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username:{
         type:String,
         required:true,
         unique:true,
         lowercase:true,
         index:true,    // if we want to search more in the database always make this field true
         trim:true      // trim:-removes the white space from the starting and ending of the name 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
   },
   fullName:{
    type:String,
    required:true,
    index:true,
    trim:true,
   },
    avatar:{
    type:String,    //cloudinary url
    required:true
   },
    coverImage:{
    type:String
   },
    watchHistory:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }
   ],
    password:{
    type:String,   // we don't write the same password on the dataase because somethimes                   //
                   //databse may leak,so we store the password in the encrypted format and for comparing(authentication)purpose we use bycrypt library      
   
     required:[true,"Password is required"],
   },
    refreshToken:{
        type:String,
    }

},{timestamps:true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) 
        return next();

    this.password=bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function 
(password){
    return await bcrypt.compare(password,this.password)   //this will return true or false
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
    {
        _id:this._id,
        username:this.username,
        fullName:this.fullName,
        email:this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRAY
    }
  )
}
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id:this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRAY
        }
      )
}
export const User = mongoose.model("User",userSchema);
