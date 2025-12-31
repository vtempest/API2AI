"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [isDevMode, setIsDevMode] = useState(false)

  useEffect(() => {
    // Check if we're in dev mode (localhost)
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      setIsDevMode(hostname === "localhost" || hostname === "127.0.0.1")
    }
  }, [])

  useEffect(() => {
    // Only redirect if not loading, not in dev mode, and no session
    if (!isPending && !session?.user && !isDevMode) {
      router.push("/login")
    }
  }, [session, isPending, router, isDevMode])

  // Show loading state while checking auth
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not in dev mode, show nothing (redirecting)
  if (!session?.user && !isDevMode) {
    return null
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm text-muted-foreground">
            {isDevMode && !session?.user && (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                Dev Mode
              </span>
            )}
          </span>
        </header>
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
