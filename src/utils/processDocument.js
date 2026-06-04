import { chunkText } from "./chunkText.js";
import { generateEmbedding } from "./generateEmbeddings.js";
import { generateSummary } from "./summaryUtil.js";

// Fallback used when model fails on a chunk
const emptySummary = (chunk) => ({
    summary: chunk.slice(0, 200),
    key_points: [],
    action_items: [],
    decisions: [],
    follow_up_questions: []
});

const processEmbeddings = async (chunks, chunkSummaries) => {
    return await Promise.all(
        chunks.map(async (chunk, index) => {

            const s = {
                summary: chunkSummaries[index]?.summary || "",
                key_points: Array.isArray(chunkSummaries[index]?.key_points) ? chunkSummaries[index].key_points : [],
                action_items: Array.isArray(chunkSummaries[index]?.action_items) ? chunkSummaries[index].action_items : [],
                decisions: Array.isArray(chunkSummaries[index]?.decisions) ? chunkSummaries[index].decisions : [],
                follow_up_questions: Array.isArray(chunkSummaries[index]?.follow_up_questions) ? chunkSummaries[index].follow_up_questions : []
            };

            const enrichedText = `
SUMMARY:
${s.summary}

KEY POINTS:
${s.key_points.join(", ")}

ACTION ITEMS:
${s.action_items.join(", ")}

DECISIONS:
${s.decisions.join(", ")}

FOLLOW UPS:
${s.follow_up_questions.join(", ")}

ORIGINAL:
${chunk}
            `;

            const embedding = await generateEmbedding(enrichedText);

            return {
                chunk_index: index,
                chunk_text: chunk,
                embedding,
                metadata: s
            };
        })
    );
};

const processSummary = async (chunks) => {
    const chunkSummaries = await Promise.all(
        chunks.map(async (chunk) => {
            try {
                return await generateSummary(chunk);
            } catch (e) {
                console.warn("Summary failed for chunk, using fallback:", e.message);
                return emptySummary(chunk);
            }
        })
    );
const mergedInput = {
    summary: chunkSummaries.map(c => c?.summary || "").join("\n\n"),
    key_points: chunkSummaries.flatMap(c => Array.isArray(c?.key_points) ? c.key_points : []),
    action_items: chunkSummaries.flatMap(c => Array.isArray(c?.action_items) ? c.action_items : []),
    decisions: chunkSummaries.flatMap(c => Array.isArray(c?.decisions) ? c.decisions : []),
    follow_up_questions: chunkSummaries.flatMap(c => Array.isArray(c?.follow_up_questions) ? c.follow_up_questions : [])
};

    // Final summary also needs a fallback
    let finalSummary;
    try {
        finalSummary = await generateSummary(JSON.stringify(mergedInput));
    } catch (e) {
        console.warn("Final summary failed, using merged input directly:", e.message);
        finalSummary = mergedInput;
    }

    return { finalSummary, chunkSummaries };
};

export const processDocument = async (rawText) => {
    const chunks = await chunkText(rawText);
    const summaryResult = await processSummary(chunks);
    const chunkData = await processEmbeddings(chunks, summaryResult.chunkSummaries);

    return {
        summary: summaryResult.finalSummary,
        chunkSummaries: summaryResult.chunkSummaries,
        chunkData
    };
};