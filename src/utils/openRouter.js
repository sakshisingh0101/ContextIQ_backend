import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const openrouter = new OpenAI({

    apiKey:
    process.env.OPENAI_API_KEY,

    baseURL:
    "https://openrouter.ai/api/v1"

});