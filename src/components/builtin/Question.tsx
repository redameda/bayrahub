"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "../ui/separator"
import { Button } from "../ui/button"
import Link from "next/link"
import { Heart } from "lucide-react"

interface User {
    _id: string
    name: string
    email: string
    profile?: string
}

interface Question {
    _id: string
    subject: string
    content: string
    writer: User
    createdAt: string
    comments: {
        _id: string
        content: string
        writer: User
        createdAt: string
    }[]
}

interface QuestionCardProps {
    question: Question
    currentUserEmail: string
}

const QuestionCard = ({ question, currentUserEmail }: QuestionCardProps) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }

    const getSubjectColor = (subject: string) => {
        const colors = [
            "bg-blue-100 text-blue-800 hover:bg-blue-200",
            "bg-green-100 text-green-800 hover:bg-green-200",
            "bg-purple-100 text-purple-800 hover:bg-purple-200",
            "bg-orange-100 text-orange-800 hover:bg-orange-200",
            "bg-pink-100 text-pink-800 hover:bg-pink-200",
            "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
        ]
        const hash = subject.split("").reduce((a, b) => {
            a = (a << 5) - a + b.charCodeAt(0)
            return a & a
        }, 0)
        return colors[Math.abs(hash) % colors.length]
    }

    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mt-auto">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={question.writer.profile || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">{question.writer.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{question.writer.name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(question.createdAt)}</p>
                    </div>
                    {
                        <Badge variant="outline" className="text-xs">
                            {question.comments.length} {question.comments.length === 1 ? "reply" : "replies"}
                        </Badge>
                    }
                </div>
                <Separator />
                <Badge className={`w-fit mb-2 ${getSubjectColor(question.subject)}`}>
                    {question.subject}
                </Badge>

                <h3 className="text-lg font-medium leading-relaxed capitalize text-balance">{question.content}</h3>
            </CardHeader>

            <CardFooter className="flex ">
                <Link href={`/questions/${question._id}`}>
                    <Button size={"sm"}>reply</Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export default QuestionCard
