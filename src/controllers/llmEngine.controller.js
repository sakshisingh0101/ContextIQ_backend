// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/apiError.js";
// import { ApiResponse } from "../utils/apiResponse.js";
// import pool from "../db/postgress.js"
// import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { extractText } from "../utils/extractText.js";
// import { generateSummary } from "../utils/summaryUtil.js";
// const uploadDocument=asyncHandler(async(req,res)=>{

//     const userId=req.user.id;

//     const {title,rawText}=req.body;

//     let finalText="";
//     let storagePath=null;
//     let fileName=null;
//     let fileType=null;


//     if(req.file)
//     {
//         fileName=req.file.originalname;
//         fileType=req.file.mimetype;

//         finalText=await extractText(req.file);
//         const cloudinaryResult = await uploadOnCloudinary(req.file.path);
//         if(!cloudinaryResult)
//         {
//             throw new ApiError(500,"Failed to upload file");
//         }
//         storagePath=cloudinaryResult.url;
//     }

//     else if(rawText?.trim())
//     {
//         finalText=rawText.trim();
//     }

//     else
//     {
//         throw new ApiError(
//             400,
//             "Provide file or rawText"
//         );
//     }

//     if(!finalText.trim())
//     {
//         throw new ApiError(
//             400,
//             "No extractable text found"
//         );
//     }
//     const summary =await generateSummary(finalText);

//     const result=await pool.query(

// `
// INSERT INTO documents
// (
// user_id,
// title,
// file_name,
// file_type,
// storage_path,
// raw_text,
// summary,
// processing_status
// )

// VALUES
// ($1,$2,$3,$4,$5,$6,$7,$8)

// RETURNING *
// `,
// [
// userId,
// title||"Untitled Document",
// fileName,
// fileType,
// storagePath,
// finalText,
// summary,
// "COMPLETED"
// ]

// );

//     return res.status(201).json(

//         new ApiResponse(
//             201,
//             "Document uploaded",
//             result.rows[0]
//         )

//     );

// });
// export {uploadDocument};

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import pool from "../db/postgress.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { extractText } from "../utils/extractText.js";
import { processDocument } from "../utils/processDocument.js"; // ← replaces generateSummary

const uploadDocument = asyncHandler(async (req, res) => {

    const userId = req.user.id;
    const { title, rawText } = req.body;

    let finalText = "";
    let storagePath = null;
    let fileName = null;
    let fileType = null;

    if (req.file) {
        fileName = req.file.originalname;
        fileType = req.file.mimetype;

        finalText = await extractText(req.file);

        const cloudinaryResult = await uploadOnCloudinary(req.file.path);
        if (!cloudinaryResult) {
            throw new ApiError(500, "Failed to upload file");
        }
        storagePath = cloudinaryResult.url;

    } else if (rawText?.trim()) {
        finalText = rawText.trim();
    } else {
        throw new ApiError(400, "Provide file or rawText");
    }

    if (!finalText.trim()) {
        throw new ApiError(400, "No extractable text found");
    }

    const { summary, chunkSummaries, chunkData } = await processDocument(finalText);

    const docResult = await pool.query(
        `
        INSERT INTO documents
        (user_id, title, file_name, file_type, storage_path, raw_text, summary, processing_status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `,
        [
            userId,
            title || "Untitled Document",
            fileName,
            fileType,
            storagePath,
            finalText,
            JSON.stringify(summary),   
            "COMPLETED"
        ]
    );

    const documentId = docResult.rows[0].id;
    console.log("Summary : ",docResult.rows[0].summary);

   
   if (chunkData.length > 0) {

    const placeholders = chunkData.map((_, i) => {
        const b = i * 5;
        return `($${b+1}, $${b+2}, $${b+3}, $${b+4}, $${b+5}::vector)`; // ← ::vector cast
    }).join(", ");

    const params = chunkData.flatMap(chunk => [
        documentId,
        chunk.chunk_index,
        chunk.chunk_text,
        JSON.stringify(chunk.metadata),
        `[${Array.from(chunk.embedding).join(",")}]`  // ← [0.1,0.2,...] format
    ]);

    await pool.query(
        `
        INSERT INTO document_chunks
        (document_id, chunk_index, chunk_text, chunk_summary, embedding)
        VALUES ${placeholders}
        `,
        params
    );
}


    return res.status(201).json(
        new ApiResponse(201, "Document processed successfully", docResult.rows[0])
    );
});
const getDocuments = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const result = await pool.query(
        `SELECT id, title, file_name, file_type, summary, processing_status, created_at 
         FROM documents 
         WHERE user_id = $1 
         ORDER BY created_at DESC`,
        [userId]
    );
    return res.status(200).json(
        new ApiResponse(200, "Documents fetched", result.rows)
    );
});

export { uploadDocument, getDocuments };

