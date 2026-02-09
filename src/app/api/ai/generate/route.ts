import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Simple in-memory throttle per server instance (good enough for dev)
// For production use Upstash/Redis rate limit.
let lastCallAt = 0;
const MIN_INTERVAL_MS = 1200; // 1.2s between calls

function sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
}

function truncate(text: string, maxChars: number) {
    if (!text) return "";
    return text.length > maxChars ? text.slice(0, maxChars) + "\n\n...[TRUNCATED]" : text;
}

async function generateWithBackoff(model: any, prompt: string) {
    const retries = 3;
    let delay = 800;

    for (let i = 0; i <= retries; i++) {
        try {
            return await model.generateContent(prompt);
        } catch (err: any) {
            const status =
                err?.status ||
                err?.response?.status ||
                err?.cause?.status ||
                err?.error?.code;

            const msg = String(err?.message || err);

            const isRateLimit =
                status === 429 ||
                msg.includes("429") ||
                msg.toLowerCase().includes("rate") ||
                msg.toLowerCase().includes("quota") ||
                msg.toLowerCase().includes("resource_exhausted");

            if (!isRateLimit || i === retries) throw err;

            await sleep(delay);
            delay *= 2;
        }
    }
    throw new Error("Unreachable");
}

function safeJsonParse(text: string) {
    // Remove markdown fences if model returns them
    const cleaned = text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/^```/i, "")
        .replace(/\s*```$/i, "");

    // Try strict JSON first
    try {
        return JSON.parse(cleaned);
    } catch {
        // Last-resort: extract first {...} block
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start >= 0 && end > start) {
            return JSON.parse(cleaned.slice(start, end + 1));
        }
        throw new Error("Model did not return valid JSON.");
    }
}

export async function POST(req: Request) {
    try {
        const { diff, fullContext } = await req.json();

        if (!diff) {
            return NextResponse.json({ message: "No diff provided" }, { status: 400 });
        }

        if (!apiKey || !genAI) {
            return NextResponse.json({
                summary:
                    "AI Summary unavailable (Missing GOOGLE_API_KEY). This is a simulated summary.",
                tags: ["mock-ai"],
                analysis: "Simulated analysis: Diff received.",
            });
        }

        // Server-side throttle (prevents burst calls from UI/dev reload)
        const now = Date.now();
        const elapsed = now - lastCallAt;
        if (elapsed < MIN_INTERVAL_MS) {
            await sleep(MIN_INTERVAL_MS - elapsed);
        }
        lastCallAt = Date.now();

        // Truncate to reduce quota usage + avoid token limit
        const diffTrimmed = truncate(String(diff), 12000);
        const ctxTrimmed = truncate(String(fullContext || ""), 4000);

        // Prefer a broadly available model; fall back if needed
        const modelNames = ["gemini-1.5-flash", "gemini-2.0-flash"];
        let lastErr: any = null;

        for (const name of modelNames) {
            try {
                const model = genAI.getGenerativeModel({
                    model: name,
                    generationConfig: { temperature: 0.2 },
                });

                const prompt = `
You are a coding assistant. Analyze this git diff and return STRICT JSON only.

Return:
{
  "summary": "string",
  "tags": ["string"],
  "analysis": "string"
}

Rules:
- Output MUST be valid JSON (no markdown, no extra text).
- tags: 3-5 short tags.

Diff:
${diffTrimmed}

Additional Context:
${ctxTrimmed || "None"}
`.trim();

                const result = await generateWithBackoff(model, prompt);
                const text = result.response.text();

                const parsed = safeJsonParse(text);

                // Basic validation
                if (!parsed?.summary || !Array.isArray(parsed?.tags) || !parsed?.analysis) {
                    throw new Error("Invalid JSON schema returned by model.");
                }

                return NextResponse.json(parsed);
            } catch (e: any) {
                lastErr = e;
                continue;
            }
        }

        throw lastErr || new Error("AI generation failed.");
    } catch (error: any) {
        console.error("AI Error:", error);

        const msg = String(error?.message || error);
        const status =
            error?.status || error?.response?.status || error?.cause?.status;

        const isRateLimit =
            status === 429 ||
            msg.includes("429") ||
            msg.toLowerCase().includes("quota") ||
            msg.toLowerCase().includes("resource_exhausted") ||
            msg.toLowerCase().includes("rate");

        if (isRateLimit) {
            return NextResponse.json(
                {
                    summary:
                        "Rate limit hit. Returning a simulated summary so UI can continue working.",
                    tags: ["rate-limited", "mock-data"],
                    analysis:
                        "Your integration is correct; Gemini rejected the request due to quota/rate limiting. Add throttling/backoff or wait for quota reset.",
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { message: "AI Generation Failed", error: msg },
            { status: 500 }
        );
    }
}
