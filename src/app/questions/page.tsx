"use client"

import { useEffect, useState } from "react"
import Navbar from "@/components/builtin/Nav"
import { Input } from "@/components/ui/input"
import { useSession } from "next-auth/react"
import QuestionCard from "@/components/builtin/Question"

// Unified User interface
interface User {
    _id: string
    name: string
    email: string // needed for checking creator
    profile?: string
}

// Unified Question interface
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

const QuestionsPage = () => {
    const { data: session } = useSession()
    const [questions, setQuestions] = useState<Question[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch("/api/questions")
                if (!res.ok) throw new Error("Failed to fetch questions")
                const data = await res.json()
                setQuestions(Array.isArray(data) ? data : [])
            } catch (error) {
                console.error("Error fetching questions:", error)
                setQuestions([])
            } finally {
                setLoading(false)
            }
        }
        fetchQuestions()
    }, [])

    const filteredQuestions = questions
        .filter(q => {
            const query = search.toLowerCase()
            return (
                q.subject.toLowerCase().includes(query) ||
                q.content.toLowerCase().includes(query)
            )
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <>
            <Navbar />

            {/* Header and Search */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-center px-4 py-4 gap-4">
                <h1 className="text-lg font-bold text-yellow-500 font-mono">QUESTIONS</h1>
                <div className="flex-1 max-w-md">
                    <Input
                        placeholder="Search by subject or question..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Questions Grid */}
            <div className="mx-auto mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
                {loading ? (
                    <p className="col-span-full text-center">Loading questions...</p>
                ) : filteredQuestions.length > 0 ? (
                    filteredQuestions.map(question => (
                        <QuestionCard
                            key={question._id}
                            question={question}
                            currentUserEmail={session?.user?.email || ""}
                        />
                    ))
                ) : (
                    <p className="col-span-full text-center">No questions found.</p>
                )}
            </div>
        </>
    )
}

export default QuestionsPage
