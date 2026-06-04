import { HfInference }
from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config();

const hf =
new HfInference(
    process.env.HF_TOKEN
);

export const generateEmbedding =
async(text)=>{

    const embedding =
    await hf.featureExtraction({

        model:
        "sentence-transformers/all-MiniLM-L6-v2",

        inputs:text

    });

    const flat = Array.isArray(embedding[0]) ? embedding[0] : embedding;

    return Array.from(flat);

}
// const result = await generateEmbedding("JWT authentication and redis session handling")
// console.log(result.length)
// console.log(result);
