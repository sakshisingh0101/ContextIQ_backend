import { openrouter } from "./openrouter.js";

export const generateChatResponse = async (userMessage, relevantChunks, chatHistory) => {

    const context = relevantChunks
        .map((chunk, i) => `[Source ${i + 1}]:\n${chunk.chunk_text}`)
        .join("\n\n");

    const messages = [
        {
            role: "system",
            content: `You are a helpful assistant that answers questions based on the provided document context.
            
Use ONLY the context below to answer. If the answer is not in the context, say "I couldn't find that in the document."
Be concise and precise.

CONTEXT:
${context}`
        },
        // inject chat history for memory
        ...chatHistory.map(msg => ({
            role: msg.role,
            content: msg.content
        })),
        {
            role: "user",
            content: userMessage
        }
    ];

    const response = await openrouter.chat.completions.create({
        model: "meta-llama/llama-3.1-8b-instruct",
        messages
    });

    return response.choices[0].message.content;
};