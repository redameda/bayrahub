import ConnectDb from "@/lib/db"
import Question from "@/models/Question"
import User from "@/models/User"
import { NextResponse } from "next/server"

export const GET = async () => {
    await ConnectDb()
    try {
        const data = await Question.find().populate("writer") // populate writer info
        return NextResponse.json(data, { status: 200 }) // ✅ return the response
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}


export const POST = async (req: Request) => {
    try {
        const { email, subject, content } = await req.json()

        if (!email || !subject || !content) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

        await ConnectDb()

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const question = await Question.create({
            subject,
            content,   // using `quest` field as per your Question schema
            writer: user._id, // corrected spelling
        })

        // add question reference to user if you store questions in User schema
        if (user.questions) {
            user.questions.push(question._id)
            await user.save()
        }

        return NextResponse.json(
            { message: "Question posted successfully", question },
            { status: 201 }
        )
    } catch (error) {
        console.error("Error posting question:", error)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
