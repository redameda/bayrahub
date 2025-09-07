"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Church, GraduationCap, Menu, X } from "lucide-react"

import AccountMenu from "./NavComp/Avatar"
import { signIn, useSession } from "next-auth/react"
import { ModeToggle } from "./ThemeToggle"
import AccountAndThemeMenu from "./NavComp/Avatar"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const links = ["Home", "Posts", "Questions", "Resources"]
    const { data: session } = useSession()
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center">
                            <GraduationCap className="h-7 w-7 text-yellow-400" />
                        </div>
                        <span className="text-xl font-bold font-mono text-foreground">BayraHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="mr-2 hidden gap-3 md:flex">
                        {links.map((l) => (
                            <Link
                                key={l}
                                className="text-bold text-sm font-bold text-foreground/80 hover:text-foreground transition-colors"
                                href={`${l == "Home" ? "/" : `/${l.toLowerCase()}`}`}
                            >
                                {l}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth + Mobile Menu Button */}
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>

                        {/* Auth Section */}
                        {!session?.user ? (
                            <Button
                                onClick={() => {
                                    signIn()
                                }}
                            >
                                SignIn
                            </Button>
                        ) : (
                            <div className="flex gap-4">
                                <AccountAndThemeMenu />
                            </div>
                        )}
                    </div>
                </div>

                {isOpen && (
                    <div className="border-t border-border bg-background md:hidden">
                        <div className="px-2 py-3 space-y-1">
                            {links.map((l) => (
                                <Link
                                    key={l}
                                    className="block px-3 py-2 text-sm font-bold text-foreground/80 hover:text-foreground hover:bg-accent rounded-md transition-colors"
                                    href={`/${l.toLowerCase()}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {l}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
