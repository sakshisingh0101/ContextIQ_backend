import pool from "../db/postgress.js";
import { generateEmbedding } from "./generateEmbeddings.js";

export const getRelevantChunks = async (query, documentId, topK = 5) => {
    const queryEmbedding = await generateEmbedding(query);
    const vectorString = `[${Array.from(queryEmbedding).join(",")}]`;

    const result = await pool.query(
        `
        SELECT chunk_text, chunk_summary,
               1 - (embedding <=> $1::vector) AS similarity
        FROM document_chunks
        WHERE document_id = $2
        ORDER BY embedding <=> $1::vector
        LIMIT $3
        `,
        [vectorString, documentId, topK]
    );

    return result.rows;
};