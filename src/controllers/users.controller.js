import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import pool from "../db/postgress.js";
import bcrypt from "bcrypt";

// Just verify cookie token and return user
const getMe = asyncHandler(async (req, res) => {
    return res.json(new ApiResponse(200, "User fetched", req.user));
});
const getProfile = asyncHandler(async(req , res)=>{
    const userId = req.user.id;
    const result = await pool.query(`SELECT id , username , email FROM users WHERE id = $1 ` ,[userId]);
    if(result.rows.length===0){
        throw new ApiError(404 ,"User not found");
    }
    return res.status(200).json(new ApiResponse(200,"User profile fetched successfully" , result.rows[0]));

}) ;

const updateProfile  = asyncHandler(async(req,res)=>{
    const user = req.user;
    const {username,email} = req.body;
    //  if(!username.trim()||!email.trim())
    //  {
    //     throw new ApiError(400,"Username and email are required");
    //  }
    const existingUser = await pool.query(`SELECT id , email , username FROM users WHERE id = $1`,[user.id]);
    if(existingUser.rows.length===0){
        throw new ApiError(404,"User not found");
    }

    const newusername = username?.trim()|| existingUser.rows[0].username;
    const newgmail = email?.trim()||existingUser.rows[0].email;
    if(!newgmail.includes('@'))
    {
        throw new ApiError(400,"Invalid email format");
    }
     const result = await pool.query(`UPDATE users SET username = $1 , email = $2 WHERE id = $3 RETURNING id , username , email `,[newusername , newgmail , user.id]);
     if(result.rows.length==0)
     {
        throw new ApiError(500,"Failed to update user profile");
     }
     return res.status(200).json(new ApiResponse(200,"User profile updated successfully" , result.rows[0]));
})

const changepassword = asyncHandler(async(req,res)=>{
    const user = req.user;
    const {currentPassword,newPassword}=req.body;
    if(!currentPassword.trim()||!newPassword.trim())
    {
        throw new ApiError(400,"Current password and new password are required");
    }
    const existingUser = await pool.query(`SELECT id , password_hash FROM users WHERE id = $1`,[user.id]);
    if(existingUser.rows.length==0){
        throw new ApiError(404,"User not found");
    }
    const hashedPassword = existingUser.rows[0].password_hash;
    const isMatch = await bcrypt.compare(currentPassword,hashedPassword);
    if(!isMatch){
        throw new ApiError(401,"Current password is incorrect");
    }
    
    const newHashedPassword = await bcrypt.hash(newPassword,10);
    const result = await pool.query(`UPDATE users SET password_hash = $1  WHERE id = $2 RETURNING id , username , email`,[newHashedPassword,existingUser.rows[0].id]);
    if(result.rows.length==0)
    {
        throw new ApiError(500,"Failed to change password");
    }
    return res.status(200).json(new ApiResponse(200,"Password changes successfully",result.rows[0]));
})
const deleteDocumentById = asyncHandler(async (req,res) => {
     const user = req.user;
     const {documentId} = req.params;
     const docResult = await pool.query(`SELECT * FROM documents WHERE id = $1 AND user_id = $2`,[documentId,user.id]);
     if(docResult.rows.length==0){
        throw new ApiError(404,"Document not found");
     }

     const deleteResult =await pool.query(`DELETE FROM documents WHERE id = $1 AND user_id = $2 RETURNING id `,[documentId,user.id]);
     if(deleteResult.rows.length==0){
        throw new ApiError(500,"Failed to delete document");
     }
     return res.status(200).json(new ApiResponse(200,"Document deleted successfully" , {id:deleteResult.rows[0].id}));
});
const deleteAllDocuments = asyncHandler(async(req,res)=>{
    const user = req.user;
    const deleteResult = await pool.query(`DELETE FROM documents WHERE user_id=$1 RETURNING id`,[user.id]);
    if(deleteResult.rows.length==0)
    {
        throw new ApiError(404,"No documents found to deleted");

    }
    return res.status(200).json(new ApiResponse(200,"All documents deleted successfully" , deleteResult));
})

export {getProfile,updateProfile,deleteAllDocuments,deleteDocumentById,changepassword};
