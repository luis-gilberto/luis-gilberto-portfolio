/**
 * StrategyIQ Intelligence Pipeline Controller
 * Manages the flow from raw input to artifact generation.
 */

// If running in Node/Worker environment
let signalEngine, artifactEngine, stagingFormatter;

if (typeof require !== 'undefined') {
    signalEngine = require('./signalEngine');
    artifactEngine = require('./artifactEngine');
    stagingFormatter = require('./stagingFormatter');
}

/**
 * Main processing pipeline
 * input → signalEngine → stagingFormatter → artifactEngine
 */
async function processIntelligencePipeline(rawInput, apiKey) {
    try {
        // 1. Execute Signal Engine
        const signalResultText = await signalEngine.processSignal(rawInput, apiKey);
        const parsedFields = parseSignalOutput(signalResultText);
        
        // 2. Execute Staging Formatter
        const stagingResult = await stagingFormatter.formatStaging(signalResultText, apiKey);
        
        // 3. Execute Artifact Engine
        const artifactInput = `Refined Insight: ${parsedFields.refinedInsight}\nRecommended Action: ${parsedFields.recommendedAction}\nOutput Type: ${parsedFields.output}`;
        const artifactResult = await artifactEngine.generateArtifact(artifactInput, apiKey);
        
        return {
            signal: parsedFields.signal,
            refinedInsight: parsedFields.refinedInsight,
            whyItMatters: parsedFields.whyItMatters,
            recommendedAction: parsedFields.recommendedAction,
            output: parsedFields.output,
            stagingPreview: stagingResult,
            artifact: artifactResult
        };
    } catch (error) {
        console.error("Pipeline Error:", error);
        throw error;
    }
}

function parseSignalOutput(text) {
    const fields = {
        signal: '',
        refinedInsight: '',
        whyItMatters: '',
        recommendedAction: '',
        output: ''
    };

    const signalMatch = text.match(/🔹 SIGNAL\s*\n([\s\S]*?)(?=\n🔹|$)/);
    const insightMatch = text.match(/🔹 REFINED INSIGHT\s*\n([\s\S]*?)(?=\n🔹|$)/);
    const whyMatch = text.match(/🔹 WHY IT MATTERS\s*\n([\s\S]*?)(?=\n🔹|$)/);
    const actionMatch = text.match(/🔹 RECOMMENDED ACTION\s*\n([\s\S]*?)(?=\n🔹|$)/);
    const outputMatch = text.match(/🔹 OUTPUT TO GENERATE\s*\n([\s\S]*?)(?=\n🔹|$)/);

    if (signalMatch) fields.signal = signalMatch[1].trim();
    if (insightMatch) fields.refinedInsight = insightMatch[1].trim();
    if (whyMatch) fields.whyItMatters = whyMatch[1].trim();
    if (actionMatch) fields.recommendedAction = actionMatch[1].trim();
    if (outputMatch) fields.output = outputMatch[1].trim();

    return fields;
}

if (typeof module !== 'undefined') {
    module.exports = { processIntelligencePipeline };
}
