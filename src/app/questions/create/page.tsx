"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import Navbar from "@/components/builtin/Nav"

const QuestionsPage = () => {
    const { data: session } = useSession()

    const [formData, setFormData] = useState({
        subject: "",
        content: "",
    })
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await fetch("/api/questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subject: formData.subject,
                content: formData.content,
                email: session?.user?.email || null,
            }),
        })

        if (!res.ok) {
            toast.error("Something went wrong while posting your question.")
        } else {
            toast.success("Question posted successfully!")
            setFormData({ subject: "", content: "" })
        }

        setLoading(false)
    }

    return (
        <>
            <Navbar />
            <div className="max-w-2xl mx-auto mt-8 p-4 space-y-6">
                <h2 className="text-xl font-semibold">Ask a Question</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Subject */}
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-1">
                            Subject
                        </label>
                        <Input
                            id="subject"
                            placeholder="Enter subject (e.g. Math, Physics...)"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Question Content */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium mb-1">
                            Question Content
                        </label>
                        <Textarea
                            id="content"
                            rows={5}
                            placeholder="Write your question here..."
                            className="resize-none"
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Submit */}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Posting..." : "Post Question"}
                    </Button>
                </form>
            </div>
        </>
    )
}

export default QuestionsPage
