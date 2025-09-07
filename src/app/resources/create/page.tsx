"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Package, ArrowLeft } from "lucide-react"
import { useEdgeStore } from "@/lib/edgestore"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

export default function ResourceUploadForm() {
    const router = useRouter()
    const { data: session } = useSession()
    const { edgestore } = useEdgeStore()

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        file: null as File | null,
    })
    const [filePreview, setFilePreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target
        setFormData((prev) => ({ ...prev, [id]: value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setFormData((prev) => ({ ...prev, file }))
        const reader = new FileReader()
        reader.onload = (e) => setFilePreview(e.target?.result as string)
        reader.readAsDataURL(file)
    }

    const removeFile = () => {
        setFormData((prev) => ({ ...prev, file: null }))
        setFilePreview(null)
    }

    const handleBack = () => router.back()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        let fileUrl: string | null = null
        if (formData.file) {
            const uploadRes = await edgestore.files.upload({ file: formData.file })
            fileUrl = uploadRes.url
        }

        const res = await fetch("/api/resources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: formData.name,
                description: formData.description,
                fileUrl,
                email: session?.user?.email || null,
            }),
        })

        if (!res.ok) toast.error("An error occurred while uploading the resource.")
        else {
            toast.success("Resource uploaded successfully!")
            setFormData({ name: "", description: "", file: null })
            setFilePreview(null)
        }

        setLoading(false)
    }

    return (
        <main className="min-h-screen bg-background p-6 max-w-2xl mx-auto">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-2">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Package className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold">Upload Resource</h1>
                </div>
                <p className="text-muted-foreground">Share your resources with the community</p>
            </header>

            <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Name */}
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter resource name" value={formData.name} onChange={handleChange} required />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                    <Label>File</Label>
                    {!filePreview ? (
                        <label htmlFor="file-upload" className="border-2 border-dashed rounded-xl p-12 flex flex-col items-center cursor-pointer hover:border-primary/50 transition-all duration-200 hover:bg-primary/5">
                            <Upload className="h-8 w-8 text-primary mb-2" />
                            Click to upload file
                            <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                        </label>
                    ) : (
                        <div className="relative border rounded-xl p-4">
                            <p>{formData.file?.name}</p>
                            <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={removeFile}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter resource description..." rows={6} value={formData.description} onChange={handleChange} />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Uploading..." : "Upload Resource"}
                </Button>
            </form>
        </main>
    )
}
