import { Avatar, AvatarFallback } from "../ui/avatar"
import { Eye, Heart, BookOpen, MessagesSquare } from "lucide-react"
import React from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader } from "../ui/card"
import Image from "next/image"
import Link from "next/link"

interface PostCardProps {
    post: {
        _id: string
        title: string
        tags: string       // single string, e.g. "math,physics"
        content: string
        writer: { name: string; profile?: string } // updated to use writer
        createdAt: string
        likes: string[]
        comments: string[]
        image?: string
    }
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
    return (
        <Card className="w-full max-w-3xl dark:border-neutral-900 mx-auto mb-6">
            {/* Header */}
            <CardHeader className="pb-none">
                <section className="flex gap-2 w-full items-center">
                    <Avatar>
                        <AvatarFallback>
                            {post.writer?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="font-bold text-yellow-500">
                            {post.writer?.name || "Unknown"}
                        </h1>
                        <p className="text-sm -mt-1.5">
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="ml-auto">
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

            {/* Body */}
            <CardContent className="p-none">
                <h1 className="text-2xl font-bold text-center">{post.title}</h1>
                {/* Removed content if you don't want to display it */}
                {/* <p className="text-sm text-muted-foreground px-4 py-2 line-clamp-3">
                    {post.content}
                </p> */}

                {/* Tags */}
                {post.tags && (
                    <div className="flex flex-wrap gap-2 px-4 pb-2">
                        {post.tags.split(",").map((tag, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary"
                            >
                                #{tag.trim()}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>

            {/* Footer */}
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
