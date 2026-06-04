import { RecursiveCharacterTextSplitter }
from "@langchain/textsplitters";

export const chunkText = async(text)=>{

    const splitter =
    new RecursiveCharacterTextSplitter({

        chunkSize:1000,

        chunkOverlap:200

    });

    const chunks =
    await splitter.splitText(text);

    return chunks;

}
const chunks =
await chunkText(`Here are the key points summarized from the research project proposal:

**Project Title:** Robust Backdoor Purification in Smart Grids

**Domain:** Cybersecurity, Industrial Control Systems, Machine Learning

**Problem Statement:**

1. Current backdoor purification frameworks assume a "Trusted Defender" scenario with access to pristine clean data, which is rarely met in real-world industrial supply chains.
2. Existing defenses are optimized for image datasets and do not account for temporal and physical dependencies in tabular sensor data.
3. There is no robust purification pipeline that remains effective when the defender's own auxiliary data is untrusted or partially poisoned.

**Literature Review:**

1. PBP (Practical Backdoor Purification, 2025) provides efficient model repair but is highly sensitive to noise or poisoning in the fine-tuning set.
2. BackdoorBenchER (2025) demonstrates that auxiliary data quality significantly impacts defense performance, but it is limited to Computer Vision and provides no solution for Poisoned Auxiliary Data scenarios.

**Proposed Methodology:**

1. Two-Stage Robust Defense Pipeline:
        * Stage 1: Correlation-Aware Sanitization (Data Level)
                + Analyzes the correlation matrix of the auxiliary dataset to flag samples that violate known physical dependencies.
                + Uses Pearson Correlation Analysis and Isolation Forests to identify anomalous sensor combinations.
                + Reconstructs model weights from only verified-clean samples to neutralize the backdoor without degrading performance on legitimate grid operations.
2. Domain Adaptation: First application of PBP-style purification on tabular ICS sensor data (SWaT dataset).
3. Physical Logic Integration: Sensor-to-sensor physical correlations used as a primary signal for data sanitization.

**Evaluation Metrics:**

1. Attack Success Rate (ASR): Percentage of malicious triggers that still bypass the model after purification.
2. Clean Accuracy (ACC): Ensures the grid's anomaly detection performance remains high for normal operational data.
3. Robustness Gain: Comparing ASR reduction in "Sanitized-PBP" vs. "Standard PBP" when 5-10% of auxiliary data is poisoned.`);

console.log(chunks.length);

console.log(chunks[0]);