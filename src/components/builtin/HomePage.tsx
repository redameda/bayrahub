import { GraduationCap, ArrowRight } from 'lucide-react'
import { signIn } from 'next-auth/react'
import React from 'react'
import { Button } from '../ui/button'

const HomePage = () => {
    return (
        <div>
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-primary-foreground/10 rounded-full">
                        <GraduationCap className="h-12 w-12 text-yellow-500" />
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold capitalize mb-6 text-balance">Welcome again dear student</h1>
                <p className="text-xl md:text-2xl mb-8 text-yellow-500 max-w-2xl capitalize mx-auto text-pretty">
                    Your all-in-one platform for academic success. Connect, learn, and thrive with fellow students.
                </p>
            </div>
        </div>
    )
}

export default HomePage