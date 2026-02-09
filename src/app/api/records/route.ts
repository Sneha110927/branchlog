import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Record from "@/models/Record";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const environment = searchParams.get("environment");
        const limit = searchParams.get("limit");
        const branch = searchParams.get("branch");
        const author = searchParams.get("author");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const query: any = { user: (session.user as any).id };
        if (environment) query.environment = environment;
        if (branch) query.branch = { $regex: branch, $options: 'i' };
        if (author) query.author = { $regex: author, $options: 'i' };

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const records = await Record.find(query)
            .sort({ createdAt: -1 })
            .limit(limit ? parseInt(limit) : 50);

        return NextResponse.json(records);
    } catch (error) {
        console.error("Error fetching records:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

import { parseDiffStats } from "@/lib/diff-utils";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // Validate required fields
        if (!data.environment || !data.branch || !data.taskId || !data.title || !data.diff) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const stats = parseDiffStats(data.diff);

        const newRecord = await Record.create({
            ...data,
            user: (session.user as any).id,
            filesChanged: stats.filesChanged,
            linesAdded: stats.linesAdded,
            linesRemoved: stats.linesRemoved
        });

        return NextResponse.json(newRecord, { status: 201 });
    } catch (error: any) {
        console.error("Error creating record:", error);
        return NextResponse.json({
            message: "Internal Error",
            details: error.message || String(error)
        }, { status: 500 });
    }
}
