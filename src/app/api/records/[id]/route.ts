import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Record from "@/models/Record";
import { parseDiffStats } from "@/lib/diff-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();

        const record = await Record.findById(id);

        if (!record) {
            return NextResponse.json({ message: "Record not found" }, { status: 404 });
        }

        return NextResponse.json(record);
    } catch (error) {
        console.error("Error fetching record:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await dbConnect();
        const deletedRecord = await Record.findByIdAndDelete(id);

        if (!deletedRecord) {
            return NextResponse.json({ message: "Record not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Record deleted successfully" });
    } catch (error) {
        console.error("Error deleting record:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();
        const record = await Record.findById(id);

        if (!record) {
            return NextResponse.json({ message: "Record not found" }, { status: 404 });
        }

        // Parse new stats if diff changed
        let stats = {};
        if (data.diff && data.diff !== record.diff) {
            stats = parseDiffStats(data.diff);
        }

        const updatedRecord = await Record.findByIdAndUpdate(
            id,
            { ...data, ...stats },
            { new: true }
        );

        return NextResponse.json(updatedRecord);
    } catch (error) {
        console.error("Error updating record:", error);
        return NextResponse.json({ message: "Internal Error" }, { status: 500 });
    }
}
