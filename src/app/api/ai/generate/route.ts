import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "dummy", // Fallback for build, but runtime needs key
});

export async function POST(req: Request) {
    try {
        const { diff, fullContext } = await req.json();

        if (!diff) {
            return NextResponse.json({ message: "No diff provided" }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            // Mock response if no key
            return NextResponse.json({
                summary: "AI Summary is unavailable (Missing OPENAI_API_KEY). This is a simulated summary based on the diff provided.",
                tags: ["feature", "mock-ai"],
                analysis: "Simulated analysis: The diff shows changes to the codebase.",
            });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful coding assistant. Analyze the following git diff and provide a concise summary of the changes, a list of 3-5 relevant tags, and a brief technical analysis. Return JSON."
                },
                {
                    role: "user",
                    content: `Diff: ${diff}\n\nAdditional Context: ${fullContext || "None"}`
                }
            ],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content from OpenAI");

        const parsed = JSON.parse(content);
        return NextResponse.json(parsed);

    } catch (error) {
        console.error("AI Error:", error);
        return NextResponse.json({ message: "AI Generation Failed" }, { status: 500 });
    }
}
