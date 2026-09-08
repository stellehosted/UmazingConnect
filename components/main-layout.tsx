"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { HomeContent } from "@/components/home-content"
import { ClubsContent } from "@/components/clubs-content"
import { useAuth } from "@/contexts/auth-context"
import { ProfileCreation } from "@/components/profile-creation"
import { LoginScreen } from "@/components/login-screen"

type ActiveSection = "home" | "clubs"

function MainLayoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeSection, setActiveSection] = useState<ActiveSection>("home")
  const { user, isAuthenticated, isLoading, hasProfile, logout } = useAuth()

  // Read section from URL on mount
  useEffect(() => {
    const section = searchParams.get("section") as ActiveSection
    if (section === "clubs" || section === "home") {
      setActiveSection(section)
    }
  }, [searchParams])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />
  }

  // Show profile creation if authenticated but no profile
  if (!hasProfile) {
    return <ProfileCreation />
  }

  // Show main app if authenticated and profile exists
  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeContent />
      case "clubs":
        return <ClubsContent />
      default:
        return <HomeContent />
    }
  }

  const handleSectionChange = (section: ActiveSection) => {
    setActiveSection(section)
    // Update URL to reflect current section
    router.push(`/?section=${section}`, { scroll: false })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
        user={user}
        onLogout={logout}
      />
      <main className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0 md:pt-16">
        {renderContent()}
      </main>
    </div>
  )
}

export function MainLayout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <MainLayoutContent />
    </Suspense>
  )
}
