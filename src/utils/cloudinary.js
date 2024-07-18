import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
    api_secret:process.env.CLOUDINARY_CLOUD_API_SECRET
});

const uploadOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null    //check wheather the file is exist or not
        //upload the file on the cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been successfully uploaded
        // console.log("File has been successfully uploaded ",response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)  //suppose the case when the file has uploaded on the server
                                      //but deu to some issues it won't able to upload on the cloudinary
                                      //so better to remove that file using file system 
    }
}

export { uploadOnCloudinary }