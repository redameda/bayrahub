"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "sonner"

interface User {
    name: string
    profile?: string
}

interface Question {
    _id: string
    subject: string
    content: string
    writer: User
    createdAt: string
}

interface QuestionCardProps {
    question: Question
    currentUserEmail: string
    onDelete?: (_id: string) => void
}

const QuestionAC = ({ question, currentUserEmail, onDelete }: QuestionCardProps) => {
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

    const handleDelete = () => {
        toast(
            <div className="flex flex-col gap-2">
                <p>Are you sure you want to delete this question?</p>
                <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => toast.dismiss()}>
                        No
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={async () => {
                            toast.dismiss()
                            try {
                                const res = await fetch(`/api/questions/${question._id}`, { method: "DELETE" })
                                if (!res.ok) throw new Error("Failed to delete question")
                                if (onDelete) onDelete(question._id)
                                toast.success("Question deleted successfully!")
                            } catch (err) {
                                console.error(err)
                                toast.error("Error deleting question")
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
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
                <Badge className={`w-fit mb-2 ${getSubjectColor(question.subject)}`}>
                    {question.subject}
                </Badge>

                <h3 className="text-lg font-medium leading-relaxed capitalize text-balance">
                    {question.content}
                </h3>
            </CardHeader>

            <CardFooter className="flex justify-between items-center">
                <Link href={`/questions/${question._id}`}>
                    <Button size="sm">Reply</Button>
                </Link>

                {question.writer.name && currentUserEmail && (
                    <Button size="sm" variant="destructive" onClick={handleDelete}>
                        Delete
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

export default QuestionAC
