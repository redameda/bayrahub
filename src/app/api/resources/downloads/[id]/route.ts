// src/app/api/resources/downloads/[id]/route.ts
import ConnectDb from "@/lib/db"
import Resource from "@/models/Resources"
import User from "@/models/User"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    await ConnectDb()

    try {
        const body = await req.json()
        const { id, email } = body

        if (!id || !email) {
            return NextResponse.json({ error: "Resource ID and email are required" }, { status: 400 })
        }

        // Find the user
        const user = await User.findOne({ email })
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

        // Find the resource
        const resource = await Resource.findById(id)
        if (!resource) return NextResponse.json({ error: "Resource not found" }, { status: 404 })

        // Add user to downloads if not already there
        if (!resource.downloads.includes(user._id.toString())) {
            resource.downloads.push(user._id)
            await resource.save()
        }

        return NextResponse.json({ downloads: resource.downloads.length })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
