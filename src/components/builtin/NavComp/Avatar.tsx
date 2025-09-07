"use client"

import * as React from "react"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Moon, Sun, LogOut, UserRound, Plus } from "lucide-react"

const AccountAndThemeMenu = () => {
    const { data: session } = useSession()
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || !session?.user) return null

    const parts = session.user.name?.split(" ") || []
    const fname = parts[0] || "User"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                    <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
                    <AvatarImage src={session.user.image as string} />
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>Hey, {fname}</DropdownMenuLabel>

                {/* Account Links */}
                <Link href="/myaccount">
                    <DropdownMenuItem>
                        <UserRound className="mr-2 w-4 h-4" /> My Account
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 w-4 h-4" /> Logout
                </DropdownMenuItem>

                <hr className="my-1 border-gray-200 dark:border-gray-700" />

                {/* Create Collapsible */}
                <Collapsible>
                    <CollapsibleTrigger asChild>
                        {/* Use a div so dropdown does not close on click */}
                        <div className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md">
                            <Plus className="w-4 h-4" /> Create
                        </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col">
                        <Link href="/posts/create">
                            <DropdownMenuItem className="pl-8">Post</DropdownMenuItem>
                        </Link>
                        <Link href="/questions/create/">
                            <DropdownMenuItem className="pl-8">Question</DropdownMenuItem>
                        </Link>
                        <Link href="/resources/create">
                            <DropdownMenuItem className="pl-8">Resource</DropdownMenuItem>
                        </Link>
                    </CollapsibleContent>
                </Collapsible>

                <hr className="my-1 border-gray-200 dark:border-gray-700" />

                {/* Theme Toggle */}
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 w-4 h-4" /> Light
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 w-4 h-4" /> Dark
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Sun className="mr-2 w-4 h-4" /> System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AccountAndThemeMenu
