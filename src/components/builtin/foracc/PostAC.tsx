"use client"

import { Eye, Heart, BookOpen, MessagesSquare, Trash2 } from "lucide-react"
import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

// Full Post type including all required properties
export interface PostType {
    _id: string
    title: string
    content: string
    tags: string
    writer: { name: string; profile?: string }
    createdAt: string
    likes: string[]
    comments: string[]
    image?: string
}

interface PostCardProps {
    post: PostType
    onDelete?: (_id: string) => void
}

export const PostAC: React.FC<PostCardProps> = ({ post, onDelete }) => {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = () => {
        toast(
            <div className="flex flex-col gap-2">
                <p>Are you sure you want to delete this post?</p>
                <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => toast.dismiss()}>
                        No
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                            toast.dismiss()
                            setDeleting(true)
                            try {
                                const res = await fetch(`/api/posts/${post._id}`, {
                                    method: "DELETE",
                                })
                                if (!res.ok) throw new Error("Failed to delete post")
                                onDelete?.(post._id)
                                toast.success("Post deleted successfully!")
                            } catch (error) {
                                console.error(error)
                                toast.error("Error deleting post")
                            } finally {
                                setDeleting(false)
                            }
                        }}
                    >
                        Yes
                    </Button>
                </div>
            </div>,
            { duration: Infinity }
        )
    }

    return (
        <Card className="w-full max-w-3xl dark:border-neutral-900 mx-auto mb-6">
            <CardHeader className="pb-none">
                <section className="flex gap-2 w-full items-center">
                    <Avatar>
                        <AvatarFallback>{post.writer?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="font-bold text-yellow-500">{post.writer?.name || "Unknown"}</h1>
                        <p className="text-sm -mt-1.5">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Button size="icon" variant="destructive" onClick={handleDelete} disabled={deleting} title="Delete post">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button size={"icon"} variant={"ghost"}>
                            <Eye />
                        </Button>
                    </div>
                </section>

                {post.image && (
                    <Image
                        src={post.image}
                        alt="post image"
                        width={1200}
                        height={500}
                        className="w-full rounded-md object-cover mt-3"
                    />
                )}
            </CardHeader>

            <CardContent className="p-none">
                <h1 className="text-2xl font-bold text-center">{post.title}</h1>

                {post.tags && (
                    <div className="flex flex-wrap gap-2 px-4 pb-2">
                        {post.tags.split(",").map((tag, i) => (
                            <span key={i} className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary">
                                #{tag.trim()}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>

            <div className="ml-auto flex w-full px-3 py-2 gap-2">
                <Link href={`posts/${post._id}`}>
                    <Button size={"sm"}>
                        <BookOpen /> Read now
                    </Button>
                </Link>

                <div className="items-center flex ml-auto gap-1">
                    <Heart className="w-4 h-4" /> {post.likes?.length || 0}
                </div>
                <div className="items-center flex ml-4 gap-1">
                    <MessagesSquare className="w-4 h-4" /> {post.comments?.length || 0}
                </div>
            </div>
        </Card>
    )
}
