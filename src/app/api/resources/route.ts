import ConnectDb from "@/lib/db"
import Resource from "@/models/Resources"
import User from "@/models/User"
import { NextResponse } from "next/server"

export const GET = async () => {
    await ConnectDb()
    try {
        const data = await Resource.find().populate("publisher", "name email profile")
        return NextResponse.json(data, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export const POST = async (req: Request) => {
    try {
        const { email, name, description, fileUrl } = await req.json()

        if (!email || !name || !description || !fileUrl) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 })
        }

        await ConnectDb()

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 })
        }

        const resource = await Resource.create({
            name,
            description,
            publisher: user._id,
            fileUrl
        })

        if (!user.resources) user.resources = []
        user.resources.push(resource._id)
        await user.save()

        return NextResponse.json({ message: "The resource has been posted", resource }, { status: 201 })
    } catch (error) {
        console.error("Error posting resource:", error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
