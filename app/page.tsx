"use client"

import Link from "next/link"
import { ArrowRight, FileJson, Server, Code2, Layers, Download, Eye } from "lucide-react"
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
                            OpenAPI & MCP Server Designer
                        </h1>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            Visual editor for creating and editing OpenAPI 3.x specifications and MCP server configurations.
                            Design your APIs with an intuitive interface.
                        </p>
                        <div className="space-x-4">
                            <Link href="/openapi-designer">
                                <Button size="lg" className="h-11 px-8">
                                    Open Designer
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
                            Everything you need to design professional API specifications.
                        </p>
                    </div>
                    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <FileJson className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>OpenAPI 3.x Support</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Full support for OpenAPI 3.0 and 3.1 specifications with visual editing for all components.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Server className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>MCP Server Config</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Design and configure Model Context Protocol servers with an intuitive interface.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Eye className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Visual Editor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    No more hand-editing YAML files. Design your APIs visually with instant validation.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Layers className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Schema Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Define reusable schemas, manage references, and keep your API definitions DRY.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Code2 className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Import & Export</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Import existing specs in JSON or YAML. Export your work in multiple formats.
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Download className="h-10 w-10 mb-2 text-primary" />
                                <CardTitle>Local Storage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Your work is auto-saved locally. Undo changes and never lose your progress.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
                <section id="cta" className="border-t">
                    <div className="container mx-auto flex flex-col items-center gap-4 py-24 text-center md:py-32">
                        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                            Ready to design your API?
                        </h2>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            Start building your OpenAPI specification today with our visual designer.
                        </p>
                        <Link href="/openapi-designer">
                            <Button size="lg" className="h-11 px-8">
                                Open Designer
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
