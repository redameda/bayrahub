"use client"

import React, { useEffect, useState } from "react"
import Navbar from "@/components/builtin/Nav"
import ResourceCard from "@/components/builtin/ResourceCard"
import { Input } from "@/components/ui/input"

interface Resource {
    _id: string
    name: string
    description: string
    fileUrl: string
    downloads: string[]
    createdAt: string
}

const ResourcesPage = () => {
    const [resources, setResources] = useState<Resource[]>([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true)
            try {
                const res = await fetch("/api/resources", { cache: "no-store" })
                if (!res.ok) throw new Error("Failed to fetch resources")
                const data: Resource[] = await res.json()
                setResources(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchResources()
    }, [])

    const filteredResources = resources.filter(
        r =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            r.description.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <>
            <Navbar />

            <div className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-10 mt-4 gap-4">
                <h1 className="text-lg md:text-2xl font-bold text-yellow-500 font-mono">Resources</h1>
                <Input
                    placeholder="Search for resources"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full md:w-1/3"
                />
            </div>

            <div className="max-w-6xl mx-auto mt-6 flex flex-wrap gap-4 px-4 md:px-0">
                {loading ? (
                    <p className="w-full text-center">Loading resources...</p>
                ) : filteredResources.length > 0 ? (
                    filteredResources.map(resource => (
                        <ResourceCard key={resource._id} resource={resource} />
                    ))
                ) : (
                    <p className="w-full text-center text-muted-foreground">No resources found.</p>
                )}
            </div>
        </>
    )
}

export default ResourcesPage
