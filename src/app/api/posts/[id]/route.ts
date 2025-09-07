import { NextRequest, NextResponse } from "next/server"
import ConnectDb from "@/lib/db"
import Post from "@/models/Posts"
import Comment from "@/models/Comment"

export async function GET(
    req: NextRequest,
    context: any // 👈 fix typing issue
) {
    const { id } = context.params
    await ConnectDb()

    try {
        let post = await Post.findById(id).populate("writer")

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 })
        }

        if (post.comments?.length > 0) {
            post = await post.populate({
                path: "comments",
                populate: { path: "writer", select: "name profile email" },
            })
        }

        return NextResponse.json(post)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, context: any) {
    const { id } = context.params
    await ConnectDb()

    try {
        const deletedPost = await Post.findByIdAndDelete(id)

        if (!deletedPost) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 })
        }

        if (deletedPost.comments?.length > 0) {
            await Comment.deleteMany({ _id: { $in: deletedPost.comments } })
        }

        return NextResponse.json({ message: "Post deleted successfully" })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Server error" }, { status: 500 })
    }
}
