// src/app/api/questions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "@/lib/db";
import Question from "@/models/Question";
import Comment from "@/models/Comment";

export async function GET(req: NextRequest, context: any) {
    const { id } = context.params;
    await ConnectDb();

    try {
        let question = await Question.findById(id).populate("writer");

        if (!question) {
            return NextResponse.json({ message: "Question not found" }, { status: 404 });
        }

        if (question.comments?.length > 0) {
            question = await question.populate({
                path: "comments",
                populate: { path: "writer", select: "name profile email" },
            });
        }

        return NextResponse.json(question);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: any) {
    const { id } = context.params;
    await ConnectDb();

    try {
        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return NextResponse.json({ message: "Question not found" }, { status: 404 });
        }

        if (deletedQuestion.comments?.length > 0) {
            await Comment.deleteMany({ _id: { $in: deletedQuestion.comments } });
        }

        return NextResponse.json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
