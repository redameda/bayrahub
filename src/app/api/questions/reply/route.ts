import { NextResponse } from "next/server"
import ConnectDb from "@/lib/db"
import Comment from "@/models/Comment"
import Question from "@/models/Question"
import User from "@/models/User"

export const POST = async (req: Request) => {
    try {
        const { email, content, questionId } = await req.json()

        if (!email || !content || !questionId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        await ConnectDb()

        // find user
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // create comment
        const comment = await Comment.create({ writer: user._id, content })

        // find question
        const question = await Question.findById(questionId)
        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 })
        }

        // add comment to question
        question.comments.push(comment._id)
        await question.save()

        // repopulate question with writer and comments (including comment authors)
        const updatedQuestion = await Question.findById(questionId)
            .populate("writer", "name profile email")
            .populate({
                path: "comments",
                populate: { path: "writer", select: "name profile email" },
            })

        return NextResponse.json(updatedQuestion, { status: 200 })
    } catch (error) {
        console.error("Error in POST /api/questions/reply:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
