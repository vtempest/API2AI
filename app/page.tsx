"use client"

import Link from "next/link"
import { ArrowRight, BarChart3, LineChart, Shield, Zap, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
                    <div className="container mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
                        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                            Build your next idea even faster.
                        </h1>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            Beautifully designed components built with Radix UI and Tailwind CSS.
                            Accessible. Customizable. Open Source.
                        </p>
                        <div className="space-x-4">
                            <Link href="/dashboard">
                                <Button size="lg" className="h-11 px-8">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/docs">
                                <Button variant="outline" size="lg" className="h-11 px-8">
                                    Documentation
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
                <section id="features" className="container mx-auto space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                            Features
                        </h2>
                        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                            This template comes with everything you need to start your next project.
                        </p>
                    </div>
                    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <BarChart3 className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Built-in analytics dashboard to track your key metrics and performance.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Zap className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Fast Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Optimized for speed with Next.js 14 and server components.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Shield className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Secure Authentication</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Authentication ready to go with Better Auth and secure sessions.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <LineChart className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Trading Ready</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Pre-built components for financial and trading applications.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <LayoutDashboard className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Dashboard</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    A fully functional dashboard implementation to jumpstart your app.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Zap className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Modern Stack</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Built with the latest tech: Next.js, Tailwind, Shadcn UI, and Stripe.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
                <section id="cta" className="border-t">
                    <div className="container mx-auto flex flex-col items-center gap-4 py-24 text-center md:py-32">
                        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                            Ready to get started?
                        </h2>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            Start building your next project today with our free template.
                        </p>
                        <Link href="/dashboard">
                            <Button size="lg" className="h-11 px-8">
                                Go to Dashboard
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
