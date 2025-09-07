"use client"

import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Badge } from "../ui/badge"

interface Resource {
    _id: string
    name: string
    description: string
    fileUrl: string
    downloads: string[]
    createdAt: string
}

interface ResourceCardProps {
    resource: Resource
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
    const [downloadCount] = useState(resource.downloads?.length || 0)

    const handleDownload = () => {
        const link = document.createElement("a")
        link.href = resource.fileUrl
        link.download = resource.name
        document.body.appendChild(link)
        link.click()
        link.remove()
    }

    return (
        <Card className="w-full md:w-[48%] shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between gap-4 rounded-lg bg-white dark:bg-gray-900">
            <div className="flex-1 space-y-2">
                <h2 className="text-lg font-bold text-yellow-500">{resource.name}</h2>
                <p className="text-sm text-muted-foreground">{resource.description}</p>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge>Downloads: <span className="font-medium">{downloadCount}</span></Badge>
                    <Badge variant="secondary">Uploaded: {new Date(resource.createdAt).toLocaleDateString()}</Badge>
                </div>
            </div>

            <div className="mt-3 self-start md:self-end">
                <Button
                    variant="outline"
                    className="flex items-center gap-2 text-sm px-4 py-2 hover:bg-yellow-50 dark:hover:bg-yellow-900 transition-colors"
                    onClick={handleDownload}
                >
                    <Download className="w-4 h-4" /> Download
                </Button>
            </div>
        </Card>
    )
}

export default ResourceCard
