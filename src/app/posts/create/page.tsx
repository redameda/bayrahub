"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"   // ✅ import session hook
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Package, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { Textarea } from "@/components/ui/textarea"
import { useEdgeStore } from "@/lib/edgestore"
import { toast } from "sonner"
import { SheetTitle } from "@/components/ui/sheet"

export default function ProductUploadForm() {
    const router = useRouter()
    const { data: session } = useSession()       // ✅ get user session
    const { edgestore } = useEdgeStore()

    const [formData, setFormData] = useState({
        title: "",
        tags: "",
        content: "",
        image: null as File | null,
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }))
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }))
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, image: null }))
        setImagePreview(null)
    }

    const handleBack = () => {
        router.back()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        let imageUrl: string | null = null

        // ✅ Upload to EdgeStore
        if (formData.image) {
            const uploadRes = await edgestore.images.upload({
                file: formData.image,
            })
            imageUrl = uploadRes.url
        }

        // ✅ Send data + email to backend
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: formData.title,
                tags: formData.tags,
                content: formData.content,
                image: imageUrl,
                email: session?.user?.email || null,   // ✅ include user email
            }),
        })
        if (!res.ok) {
            toast.error("an error occured while trying to post try again")
        }
        else {
            toast.success("Post created succesfully.")

        }
        setLoading(false)

    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleBack}
                            className="p-2 hover:bg-primary/10"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <Package className="h-6 w-6 text-primary" />
                            <h1 className="text-3xl font-bold">Upload Post</h1>
                        </div>
                    </div>
                    <p className="text-muted-foreground ml-12">
                        Create and share your content with the community
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Title */}
                    <div className="space-y-3">
                        <Label htmlFor="title" className="text-base font-medium">
                            Title
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            placeholder="Enter an engaging title for your post"
                            value={formData.title}
                            onChange={handleChange}
                            className="h-12 text-base"
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium">Featured Image</Label>
                        {!imagePreview ? (
                            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-all duration-200 hover:bg-primary/5">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="cursor-pointer flex flex-col items-center gap-4"
                                >
                                    <div className="p-4 bg-primary/10 rounded-full">
                                        <Upload className="h-8 w-8 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-lg font-medium">
                                            Click to upload image
                                        </span>
                                        <p className="text-sm text-muted-foreground">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </label>
                            </div>
                        ) : (
                            <div className="relative w-full h-80 rounded-xl overflow-hidden border">
                                <Image
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Post preview"
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-4 right-4 shadow-lg"
                                    onClick={removeImage}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                        <Label htmlFor="tags" className="text-base font-medium">
                            Tags
                        </Label>
                        <Input
                            id="tags"
                            type="text"
                            placeholder="Add tags separated by commas (e.g., design, tutorial, tips)"
                            value={formData.tags}
                            onChange={handleChange}
                            className="h-12 text-base"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <Label htmlFor="content" className="text-base font-medium">
                            Content
                        </Label>
                        <Textarea
                            id="content"
                            placeholder="Write your post content here..."
                            rows={12}
                            className="text-base resize-none"
                            value={formData.content}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit */}
                    <div className="pt-6">
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-12 text-base font-medium"
                            disabled={loading}
                        >
                            {loading ? "Publishing..." : "Publish Post"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
