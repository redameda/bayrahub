import { NextResponse } from "next/server"
import ConnectDb from "@/lib/db"
import Comment from "@/models/Comment"
import Post from "@/models/Posts"
import User from "@/models/User"

export const POST = async (req: Request) => {
    try {
        const { email, content, postId } = await req.json()

        if (!email || !content || !postId) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 })
        }

        await ConnectDb()

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const comment = await Comment.create({ writer: user._id, content })

        const post = await Post.findById(postId)
        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 })
        }

        post.comments.push(comment._id)
        await post.save()

        // repopulate with user and comments for frontend
        const updatedPost = await Post.findById(postId)
            .populate("writer", "name profile")
            .populate({
                path: "comments",
                populate: { path: "writer", select: "name profile" },
            })

        return NextResponse.json(updatedPost, { status: 200 })
    } catch (error) {
        console.error("Error in POST /api/posts/comments:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
