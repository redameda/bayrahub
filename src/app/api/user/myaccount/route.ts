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
            .populate("posts")
            .populate("questions")
            .populate("resources")

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Convert Mongoose document to plain JS object
        const u = user.toObject()

        // Build a safe response
        const safeUserData = {
            name: u.name || "User",
            email: u.email || "unknown@example.com",
            profile: u.profile || "",
            posts: Array.isArray(u.posts)
                ? u.posts.map((p: any) => ({
                    _id: p._id,
                    title: p.title || "",
                    content: p.content || "",
                    tags: p.tags || "",
                    image: p.image || "",
                    createdAt: p.createdAt || new Date().toISOString(),
                    likes: Array.isArray(p.likes) ? p.likes : [],
                    comments: Array.isArray(p.comments) ? p.comments : [],
                    writer: { name: p.writer?.name || "User", profile: p.writer?.profile || "" },
                }))
                : [],
            questions: Array.isArray(u.questions)
                ? u.questions.map((q: any) => ({
                    _id: q._id,
                    subject: q.subject || "",
                    content: q.content || "",
                    createdAt: q.createdAt || new Date().toISOString(),
                    writer: { name: q.writer?.name || "User", profile: q.writer?.profile || "" },
                }))
                : [],
            resources: Array.isArray(u.resources)
                ? u.resources.map((r: any) => ({
                    _id: r._id,
                    name: r.name || "",
                    description: r.description || "",
                    fileUrl: r.fileUrl || "",
                    downloads: Array.isArray(r.downloads) ? r.downloads : [],
                    createdAt: r.createdAt || new Date().toISOString(),
                }))
                : [],
        }

        return NextResponse.json(safeUserData, { status: 200 })
    } catch (error) {
        console.error("API ERROR:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
