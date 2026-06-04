import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import pool from "../db/postgress.js";
import { getRelevantChunks } from "../utils/ragUtil.js";
import { generateChatResponse } from "../utils/chatUtil.js";

// ── 1. Start a new conversation ──────────────────────────────────
const createConversation = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { documentId, title } = req.body;

    // verify document belongs to user
    const doc = await pool.query(
        `SELECT id FROM documents WHERE id = $1 AND user_id = $2`,
        [documentId, userId]
    );

    if (doc.rows.length === 0) {
        throw new ApiError(404, "Document not found");
    }

    const result = await pool.query(
        `INSERT INTO conversations (user_id, document_id, title)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, documentId, title || "New Conversation"]
    );

    return res.status(201).json(
        new ApiResponse(201, "Conversation created", result.rows[0])
    );
});

// ── 2. Send a message (RAG + history) ───────────────────────────
const sendMessage = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
        throw new ApiError(400, "Message is required");
    }

    // verify conversation belongs to user + get documentId
    const convResult = await pool.query(
        `SELECT c.*, d.id as document_id 
         FROM conversations c
         JOIN documents d ON d.id = c.document_id
         WHERE c.id = $1 AND c.user_id = $2`,
        [conversationId, userId]
    );

    if (convResult.rows.length === 0) {
        throw new ApiError(404, "Conversation not found");
    }

    const { document_id } = convResult.rows[0];

    // fetch last 10 messages as chat history
    const historyResult = await pool.query(
        `SELECT role, content FROM messages
         WHERE conversation_id = $1
         ORDER BY created_at ASC
         LIMIT 10`,
        [conversationId]
    );
    const chatHistory = historyResult.rows;

    // RAG: get relevant chunks for the query
    const relevantChunks = await getRelevantChunks(message, document_id);

    // generate response
    const aiResponse = await generateChatResponse(
        message,
        relevantChunks,
        chatHistory
    );

    // save user message
    await pool.query(
        `INSERT INTO messages (conversation_id, role, content)
         VALUES ($1, $2, $3)`,
        [conversationId, "user", message]
    );

    // save assistant message
    const savedResponse = await pool.query(
        `INSERT INTO messages (conversation_id, role, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [conversationId, "assistant", aiResponse]
    );

    return res.status(200).json(
        new ApiResponse(200, "Message sent", {
            message: savedResponse.rows[0],
            sources: relevantChunks.map(c => ({
                text: c.chunk_text.slice(0, 150) + "...",
                similarity: c.similarity
            }))
        })
    );
});

// ── 3. Get conversation history ──────────────────────────────────
const getConversation = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { conversationId } = req.params;

    const messages = await pool.query(
        `SELECT m.* FROM messages m
         JOIN conversations c ON c.id = m.conversation_id
         WHERE m.conversation_id = $1 AND c.user_id = $2
         ORDER BY m.created_at ASC`,
        [conversationId, userId]
    );

    return res.status(200).json(
        new ApiResponse(200, "Messages fetched", messages.rows)
    );
});

export { createConversation, sendMessage, getConversation };