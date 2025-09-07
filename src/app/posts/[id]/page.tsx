"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Navbar from "@/components/builtin/Nav"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessagesSquare, Eye, Send } from "lucide-react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

interface User {
    name: string
    email: string
    _id: string
    profile?: string
}

interface Comment {
    _id: string
    content: string
    writer: User
    createdAt: string
}

interface Post {
    _id: string
    title: string
    tags: string[] | string
    content: string
    image: string
    writer: User
    createdAt: string
    comments: Comment[]
}

const PostPage = () => {
    const { id } = useParams<{ id: string }>()
    const [post, setPost] = useState<Post | null>(null)
    const [comment, setComment] = useState("")
    const { data: session } = useSession()

    // Fetch post
    const fetchPost = async () => {
        try {
            const res = await fetch(`/api/posts/${id}`, {
                cache: "no-store",
            })
            if (!res.ok) throw new Error("Failed to fetch post")
            const data: Post = await res.json()
            setPost(data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (id) fetchPost()
    }, [id])

    // Submit comment
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!comment.trim() || !post) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session?.user?.email,
                    content: comment,
                    postId: post._id,
                }),
            })

            if (!res.ok) {
                toast.error("Please try again")
                return
            }

            const updatedPost: Post = await res.json()
            setPost(updatedPost) // refresh UI with updated post
            setComment("")
            toast.success("Comment added successfully.")
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        }
    }

    if (!post) {
        return <p className="text-center mt-10">Loading post...</p>
    }

    const isYourPost = session?.user?.email === post.writer.email

    return (
        <>
            <Navbar />

            <div className="max-w-3xl mx-auto mt-6 space-y-6">
                {/* Post Card */}
                <Card className="w-full dark:border-neutral-900">
                    <CardHeader>
                        <section className="flex gap-2 w-full items-center">
                            <Avatar>
                                <AvatarFallback>{post.writer?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                                <AvatarImage src={post.writer?.profile || "/placeholder.svg"} />
                            </Avatar>
                            <div>
                                <h1 className="font-bold text-yellow-500">
                                    {post.writer?.name} {isYourPost && <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded">Your Post</span>}
                                </h1>
                                <p className="text-sm -mt-1.5">{new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="ml-auto">
                                <Button size={"icon"} variant={"ghost"}>
                                    <Eye />
                                </Button>
                            </div>
                        </section>

                        {post.image && (
                            <Image
                                src={post.image || "/placeholder.svg"}
                                alt="post image"
                                width={1200}
                                height={500}
                                className="w-full rounded-md object-cover mt-3"
                            />
                        )}
                    </CardHeader>

                    <CardContent>
                        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                        <p className="text-base text-muted-foreground whitespace-pre-wrap mb-4">{post.content}</p>

                        {post.tags && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {(Array.isArray(post.tags) ? post.tags : post.tags.split(",")).map((tag, i) => (
                                    <span key={i} className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary">
                                        #{tag.toString().trim()}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center gap-1">
                            <MessagesSquare className="w-4 h-4" /> {post.comments?.length || 0}
                        </div>
                    </CardContent>
                </Card>

                {/* Comment Form */}
                <Card className="w-full dark:border-neutral-900">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">Add a Comment</h2>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <Textarea
                                placeholder="Write your comment here..."
                                className="min-h-[100px] resize-none"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" className="flex items-center gap-2">
                                    <Send className="w-4 h-4" />
                                    Post Comment
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Comments */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Comments ({post.comments?.length || 0})</h2>

                    {post.comments && post.comments.length > 0 ? (
                        post.comments.map((c) => {
                            const isCreatorComment = c.writer?.email === post.writer.email
                            return (
                                <Card key={c._id} className="w-full dark:border-neutral-900">
                                    <CardHeader className="pb-3">
                                        <section className="flex gap-2 w-full items-center">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="text-sm">
                                                    {c.writer?.name?.charAt(0).toUpperCase() || "U"}
                                                </AvatarFallback>
                                                <AvatarImage src={c.writer?.profile || "/placeholder.svg"} />
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold text-sm text-yellow-500">
                                                    {c.writer?.name} {isCreatorComment && <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded">Creator</span>}
                                                </h3>
                                                <p className="text-xs text-muted-foreground -mt-0.5">
                                                    {new Date(c.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </section>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-sm whitespace-pre-wrap">{c.content}</p>
                                    </CardContent>
                                </Card>
                            )
                        })
                    ) : (
                        <Card className="w-full dark:border-neutral-900">
                            <CardContent className="py-8 text-center">
                                <MessagesSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    )
}

export default PostPage
