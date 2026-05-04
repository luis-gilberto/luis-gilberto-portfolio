/**
 * Cloudflare Pages Function: POST /api/signals/process
 * Logic: input → signalEngine → stagingFormatter → artifactEngine
 */

// Since Cloudflare Pages Functions are bundled, we can't use 'require' for local files easily without a build step.
// For this surgical implementation, we include the logic directly in the function or assume a flat structure.

export async function onRequestPost(context) {
    try {
        const { request, env } = context;
        const apiKey = env.ANTHROPIC_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: "LLM provider not configured" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        console.log(`Debug: API Key starts with ${apiKey.substring(0, 5)}`);

        const body = await request.json();
        const rawInput = body.text || "";
        const isDebug = body.debug === true;

        if (!rawInput) {
            return new Response(JSON.stringify({ error: "No input text provided" }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        // --- PROMPTS ---
        const SIGNAL_ENGINE_PROMPT = `You are the Signal Intelligence Engine inside a strategic system.

Your role is to analyze raw inputs (transcripts, notes, documents, voice captures) and convert them into clear, human, actionable intelligence.

IMPORTANT:
- Do NOT use consultant jargon
- Do NOT sound robotic or academic
- Output must feel natural, clear, and immediately usable
- Prioritize clarity over sophistication
- This system is guided by human decision-making, not replacing it
- Do not jump directly to scaling models, facilitator certification, or community architecture unless the input specifically points to delivery capacity, training others, or founder burnout. 
- When the signal relates to parent friction, prioritize immediate tools, protocols, scripts, and scenario-based guidance.

PRIORITIZATION RULES:
Every analysis must follow this priority order:
1. Immediate parent-facing need: What does the parent need help with right now?
2. Practical protocol opportunity: What simple guide, script, playbook, or protocol could help?
3. System/product implication: What capability should the platform build to deliver this repeatedly?
4. Long-term scale opportunity: Only mention facilitator/community/certification models if clearly supported, and label them as "Future Scale Opportunity".

PROCESS:

1. Identify the most meaningful signal (not everything, only what matters)
2. Detect patterns if present
3. Translate into plain, human language (Clarity Layer)
4. Identify the tension or gap
5. Recommend a clear next action (Focus on practical, scenario-based guidance for parent-friction)
6. Define what tangible output should be created

---

OUTPUT FORMAT:

🔹 SIGNAL 
(Short description of what was observed)

🔹 REFINED INSIGHT 
(Human, clear, no jargon. For parent-friction, use titles like "From Philosophy to Real-Time Support" or "Protocol-First Support for Daily Parenting Challenges")

🔹 WHY IT MATTERS 
(Explain the tension or gap in simple terms)

🔹 RECOMMENDED ACTION 
(Specific, practical next step. Avoid premature scaling. Example: "Convert high-friction parenting moments into simple, reusable protocols.")

🔹 OUTPUT TO GENERATE 
(Name the artifact that should be created. Example: Playbook, Guide, Protocol, Slide, Module)

---

STYLE EXAMPLE:

Bad:
"Move toward a certified facilitator model."
"Build community-led architecture."

Good:
"Create a screen-time transition playbook parents can use in the moment."
"Develop scenario-based guidance for emotional escalation."

---

Only return the structured output. Do not explain your reasoning.`;

        const STAGING_LAYER_PROMPT = `You are the Staging Layer of a strategic intelligence system.

Your role is to present newly processed signals in a way that feels clear, structured, and ready for human approval.

IMPORTANT:
- This is not raw output
- This is a curated, human-readable preview
- Must feel premium, minimal, and intentional

---

INPUT:
Structured output from the Signal Intelligence Engine

---

YOUR TASK:

Format the output as a staging card preview.

---

OUTPUT FORMAT:

SIGNAL DETECTED 
(Source: [if available])

---

REFINED INSIGHT 
(Primary focus. Clean, human, easy to read)

---

WHAT THIS REVEALS 
(Simple explanation of the tension or gap)

---

SUGGESTED NEXT STEP 
(Clear, actionable direction)

---

READY TO GENERATE 
(Name of artifact)

---

STATUS:
[ ] Approve 
[ ] Edit 
[ ] Hold 

---

STYLE:
- Minimal
- Clean spacing
- No fluff
- Feels like a decision interface, not a report`;

        const ARTIFACT_ENGINE_PROMPT = `You are the Artifact Generator inside a strategic system.

Your role is to take a defined action and output requirement, and immediately create a usable, real-world asset.

IMPORTANT:
- Output must be practical, not theoretical
- Must feel human, simple, and usable in real life
- Avoid jargon, avoid over-explaining
- This is meant for immediate application

INPUT YOU WILL RECEIVE:
- Refined Insight
- Recommended Action
- Output Type

---

YOUR TASK:

Generate the requested artifact.

---

OUTPUT REQUIREMENTS:

- Clear title
- Simple structure
- Real-world usability
- If relevant, include multiple options (not one rigid solution)
- Keep tone aligned with “guilt-free, empowering, human”

---

EXAMPLE TYPES OF OUTPUT:

If Playbook:
→ Step-by-step or options-based guidance

If Protocol:
→ Clear actions in sequence or choices

If Guide:
→ Short, structured, practical explanation

---

STYLE EXAMPLE:

Instead of:
"You should establish boundaries"

Write:
"Option A: Give a 5-minute warning and let them choose what happens next 
Option B: Stay calm and hold the boundary while acknowledging emotions"

---

Only return the artifact. No explanation.`;

        // --- HELPER ---
        async function callAnthropic(apiKey, systemPrompt, userMessage) {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-5',
                    max_tokens: 1000,
                    system: systemPrompt,
                    messages: [{ role: 'user', content: userMessage }]
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return data.content[0].text;
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

        // --- PIPELINE EXECUTION ---
        
        console.log("Signal Engine executed");
        const signalOutputText = await callAnthropic(apiKey, SIGNAL_ENGINE_PROMPT, rawInput);
        const parsedFields = parseSignalOutput(signalOutputText);
        
        console.log("Staging generated");
        const stagingPreview = await callAnthropic(apiKey, STAGING_LAYER_PROMPT, signalOutputText);
        
        console.log("Artifact created");
        const artifactInput = `Refined Insight: ${parsedFields.refinedInsight}\nRecommended Action: ${parsedFields.recommendedAction}\nOutput Type: ${parsedFields.output}`;
        const artifact = await callAnthropic(apiKey, ARTIFACT_ENGINE_PROMPT, artifactInput);

        const response = {
            signal: parsedFields.signal,
            refinedInsight: parsedFields.refinedInsight,
            whyItMatters: parsedFields.whyItMatters,
            recommendedAction: parsedFields.recommendedAction,
            output: parsedFields.output,
            stagingPreview: stagingPreview,
            artifact: artifact
        };

        if (isDebug) {
            response.debug = {
                deploymentCommit: "d4b8a95",
                provider: "anthropic",
                hasAnthropicKey: !!apiKey,
                anthropicKeyPrefix: apiKey ? apiKey.substring(0, 12) : "none",
                anthropicKeyLength: apiKey ? apiKey.length : 0,
                model: 'claude-sonnet-4-5',
                functionFileVersion: "process-js-d4b8a95-v4.5"
            };
        }

        return new Response(JSON.stringify(response), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
