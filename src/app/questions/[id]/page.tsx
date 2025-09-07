"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { toast } from "sonner"

interface User {
    _id: string
    name: string
    email: string
    profile?: string
}

interface Comment {
    _id: string
    content: string
    writer: User
    createdAt: string
}

interface Question {
    _id: string
    subject: string
    content: string
    writer: User
    createdAt: string
    comments: Comment[]
}

const QuestionPage = () => {
    const { id } = useParams<{ id: string }>()
    const { data: session } = useSession()
    const [question, setQuestion] = useState<Question | null>(null)
    const [reply, setReply] = useState("")
    const [loading, setLoading] = useState(true)

    // fetch question
    useEffect(() => {
        if (!id) return

        const fetchQuestion = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/questions/${id}`, { cache: "no-store" })
                if (!res.ok) throw new Error("Failed to fetch question")
                const data: Question = await res.json()
                setQuestion(data)
            } catch (err) {
                console.error(err)
                toast.error("Could not load question")
            } finally {
                setLoading(false)
            }
        }

        fetchQuestion()
    }, [id])

    // submit reply
    const handleReply = async () => {
        if (!reply.trim() || !question) return

        try {
            const res = await fetch("/api/questions/reply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: reply,
                    questionId: question._id,
                    email: session?.user?.email,
                }),
            })

            if (!res.ok) throw new Error("Failed to reply")

            const updatedQuestion: Question = await res.json()
            setQuestion(updatedQuestion)
            setReply("")
            toast.success("Reply added!")
        } catch (err) {
            console.error(err)
            toast.error("Could not post reply")
        }
    }

    if (loading) return <p className="text-center mt-10">Loading question...</p>
    if (!question) return <p className="text-center mt-10">Question not found</p>

    const isYourQuestion = question.writer.email === session?.user?.email

    return (
        <div className="max-w-3xl mx-auto mt-6 space-y-6">
            {/* Question */}
            <Card className="w-full dark:border-neutral-900">
                <CardHeader>
                    <section className="flex gap-2 items-center">
                        <Avatar>
                            <AvatarFallback>{question.writer.name.charAt(0).toUpperCase()}</AvatarFallback>
                            <AvatarImage src={question.writer.profile || "/placeholder.svg"} />
                        </Avatar>
                        <div>
                            <h2 className="font-bold text-yellow-500">
                                {question.writer.name} {isYourQuestion && <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-500 text-white rounded">Your Question</span>}
                            </h2>
                            <p className="text-sm -mt-1.5">{new Date(question.createdAt).toLocaleDateString()}</p>
                        </div>
                    </section>
                    <h3 className="mt-3 font-semibold text-lg">{question.subject}</h3>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 whitespace-pre-wrap">{question.content}</p>
                </CardContent>
            </Card>

            {/* Reply Form */}
            <Card className="w-full dark:border-neutral-900">
                <CardHeader>
                    <h2 className="text-lg font-semibold">Add a Reply</h2>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="Write your reply..."
                        className="min-h-[80px] resize-none mb-2"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button size="sm" className="flex items-center gap-2" onClick={handleReply}>
                            <Send className="w-4 h-4" /> Reply
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Replies */}
            <div className="space-y-4">
                {question.comments.length > 0 ? (
                    question.comments.map((c) => {
                        const isAuthor = c.writer.email === question.writer.email
                        return (
                            <Card key={c._id} className="p-2 dark:border-neutral-800">
                                <section className="flex gap-2 items-center mb-1">
                                    <Avatar className="w-6 h-6">
                                        <AvatarFallback>{c.writer.name.charAt(0).toUpperCase()}</AvatarFallback>
                                        <AvatarImage src={c.writer.profile || "/placeholder.svg"} />
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-semibold text-yellow-500">
                                            {c.writer.name} {isAuthor && <span className="ml-1 px-1 text-xs bg-blue-500 text-white rounded">Creator</span>}
                                        </p>
                                        <p className="text-xs text-muted-foreground -mt-0.5">{new Date(c.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </section>
                                <p className="text-sm whitespace-pre-wrap">{c.content}</p>
                            </Card>
                        )
                    })
                ) : (
                    <p className="text-muted-foreground text-sm text-center py-4">No replies yet. Be the first to reply!</p>
                )}
            </div>
        </div>
    )
}

export default QuestionPage
