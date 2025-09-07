"use client"

import React, { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowLeft, LogOut } from "lucide-react"
import { PostAC } from "@/components/builtin/foracc/PostAC"
import QuestionAC from "@/components/builtin/foracc/QuestionAC"
import ResourceAC from "@/components/builtin/foracc/ResourcesAC"

interface Post {
    _id: string
    title: string
    content: string
    tags: string
    image?: string
    createdAt: string
    likes: string[]
    comments: string[]
    writer: { name: string; profile?: string }
}

interface Question {
    _id: string
    subject: string
    content: string
    writer: { name: string; profile?: string }
    createdAt: string
}

interface Resource {
    _id: string
    name: string
    description: string
    fileUrl: string
    downloads: string[]
    createdAt: string
}

interface UserData {
    name: string
    email: string
    profile?: string
    posts: Post[]
    questions: Question[]
    resources: Resource[]
}

const AccountPage = () => {
    const { data: session } = useSession()
    const [userData, setUserData] = useState<UserData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            try {
                const res = await fetch("/api/user/myaccount")
                const data: UserData = await res.json()
                setUserData(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])

    if (loading) return <p className="text-center py-8">Loading account...</p>
    if (!userData) return <p className="text-center py-8 text-red-500">Failed to load account data.</p>

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            <nav className="w-full h-16 border-b flex justify-center items-center">
                <h1 className="text-2xl font-bold text-yellow-500">My Account</h1>
            </nav>

            {/* Profile Card */}
            <Card className="m-5">
                <CardHeader className="flex justify-between items-center">
                    <Link href="/">
                        <Button size="icon" variant="outline">
                            <ArrowLeft />
                        </Button>
                    </Link>
                    <CardTitle>Profile Information</CardTitle>
                    <Button size="sm" variant="destructive" onClick={() => signOut()}>
                        Logout <LogOut />
                    </Button>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={userData.profile || ""} />
                            <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center md:text-left">
                            <h3 className="font-semibold text-lg">{userData.name}</h3>
                            <p className="text-slate-600">{userData.email}</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="posts">
                        <div className="flex justify-center py-2">
                            <TabsList>
                                <TabsTrigger value="posts">Posts</TabsTrigger>
                                <TabsTrigger value="questions">Questions</TabsTrigger>
                                <TabsTrigger value="resources">Resources</TabsTrigger>
                            </TabsList>
                        </div>

                        {/* Posts Tab */}
                        <TabsContent value="posts">
                            {userData.posts.length ? (
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {userData.posts.map((post) => (
                                        <PostAC key={post._id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-4 text-muted-foreground">No posts found.</p>
                            )}
                        </TabsContent>

                        {/* Questions Tab */}
                        <TabsContent value="questions">
                            {userData.questions.length ? (
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {userData.questions.map((q) => (
                                        <QuestionAC key={q._id} question={q} currentUserEmail={userData.email} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-4 text-muted-foreground">No questions found.</p>
                            )}
                        </TabsContent>

                        {/* Resources Tab */}
                        <TabsContent value="resources">
                            {userData.resources.length ? (
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {userData.resources.map((res) => (
                                        <ResourceAC key={res._id} resource={res} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-4 text-muted-foreground">No resources found.</p>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default AccountPage
