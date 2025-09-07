import React from 'react'
import { Button } from '../ui/button'
import { Share2, Users, BookOpen, Church, ArrowRight, Calendar, Clock, GraduationCap, MessageSquare } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import Link from 'next/link'
import { signIn } from 'next-auth/react'

const Wel = () => {
    return (
        <div className="min-h-screen  transition-colors">

            {/* Hero Section */}
            <section className="bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 py-16 text-center">
                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-primary-foreground/10 rounded-full">
                            <GraduationCap className="h-12 w-12 text-primary-foreground" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Welcome to BayraHub</h1>
                    <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
                        Your all-in-one platform for academic success. Connect, learn, and thrive with fellow students.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={() => { signIn() }}
                            className="text-lg px-8 py-3 hover:bg-secondary/90 transition-colors">
                            Join Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 py-3 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 transition-colors bg-transparent"
                        >
                            About Us
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
                        Everything You Need to Succeed
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 dark:hover:shadow-primary/10">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                                    <BookOpen className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-xl text-card-foreground">Study Resources</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-muted-foreground">
                                    Access shared notes, study guides, and course materials from your peers and professors
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 dark:hover:shadow-primary/10">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-xl text-card-foreground">Study Groups</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-muted-foreground">
                                    Form study groups, find study partners, and collaborate on projects with classmates
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 dark:hover:shadow-primary/10">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                                    <Calendar className="h-8 w-8 text-primary" />
                                </div>
                                <CardTitle className="text-xl text-card-foreground">Academic Calendar</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-muted-foreground">
                                    Keep track of assignments, exams, and important deadlines all in one place
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-muted">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Quick Access</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:bg-accent/10 transition-colors bg-card border-border text-card-foreground"
                        >
                            <Clock className="h-6 w-6 text-primary" />
                            <span className="font-medium">Class Schedule</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:bg-accent/10 transition-colors bg-card border-border text-card-foreground"
                        >
                            <MessageSquare className="h-6 w-6 text-primary" />
                            <span className="font-medium">Discussion Forums</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col gap-2 hover:bg-accent/10 transition-colors bg-card border-border text-card-foreground"
                        >
                            <GraduationCap className="h-6 w-6 text-primary" />
                            <span className="font-medium">Grade Tracker</span>
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground text-balance">
                        Ready to Excel in Your Studies?
                    </h2>
                    <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto text-pretty">
                        Join thousands of students who are already using Student Hub to boost their academic performance
                    </p>
                    <Button
                        size="lg"
                        className="text-lg px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
                    >
                        Get Started Today
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-muted border-t border-border py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-muted-foreground">© 2024 Student Hub. Empowering academic success.</p>
                </div>
            </footer>
        </div>
    )
}

export default Wel