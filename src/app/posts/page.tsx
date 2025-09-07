"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/builtin/Nav"
import { Input } from "@/components/ui/input"
import { PostCard } from "@/components/builtin/Postc"

interface User {
    _id: string
    name: string
    profile: string
    crews?: string[]
}

interface Post {
    _id: string
    title: string
    tags: string
    content: string
    writer: User
    createdAt: string
    likes: string[]
    comments: string[]
    image: string
}

const PostsPage = () => {
    const [posts, setPosts] = useState<Post[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch("/api/posts")
                if (!res.ok) throw new Error("Failed to fetch posts")
                const data = await res.json()
                setPosts(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Error fetching posts:", error)
                setPosts([])
            } finally {
                setLoading(false)
            }
        }
        fetchPosts()
    }, [])

    const filteredPosts = posts
        .filter(post => {
            const query = search.toLowerCase()
            return (
                post.title.toLowerCase().includes(query) ||
                post.tags.toLowerCase().includes(query)
            )
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <>
            <Navbar />

            {/* Header and Search */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-center px-4 py-4 gap-4">
                <h1 className="text-lg font-bold text-yellow-500 font-mono">POSTS</h1>
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Search by title or tags..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Posts Grid */}
            <div className="mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
                {loading ? (
                    <p className="col-span-full text-center">Loading posts...</p>
                ) : filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post} // pass entire post, PostCard expects writer inside
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center">No posts found.</p>
                )}
            </div>
        </>
    )
}

export default PostsPage
