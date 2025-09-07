import authOptions from "@/lib/authoptions"
import ConnectDb from "@/lib/db"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export const GET = async () => {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        await ConnectDb()

        const user = await User.findOne({ email: session.user.email })
            .populate("questions")
            .populate("resources")
            .populate("posts") // make sure the field is lowercase if that's your schema

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json(user, { status: 200 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
