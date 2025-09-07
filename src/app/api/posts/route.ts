import ConnectDb from "@/lib/db";
import Post from "@/models/Posts";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await ConnectDb()
        const posts = await Post.find()
            .populate("writer")
            .lean() // ensures it's plain JS objects

        // always return an array, even if empty
        return NextResponse.json(posts || [])
    } catch (error) {
        console.error("Error fetching posts:", error)
        return NextResponse.json({ message: "Error fetching posts" }, { status: 500 })
    }
}

export const POST = async (req: Request) => {
    const data = await req.json();
    const { email, title, content, image, tags } = data;

    await ConnectDb();

    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ message: "User not found" });
    }

    try {
        // Create the post
        const post = await Post.create({ writer: user._id, title, content, tags, image });

        // Add post ID to user's userPosts array
        user.posts.push(post._id);
        await user.save();

        return NextResponse.json({ message: "You created successfully", post });
    } catch (err: any) {
        return NextResponse.json({ message: "Process unsuccessful", error: err.message });
    }
};
