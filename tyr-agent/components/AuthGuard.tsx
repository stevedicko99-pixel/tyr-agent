'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
  publicPaths?: string[]
}

export function AuthGuard({ children, publicPaths = [] }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.push('/auth/login')
    }
  }, [user, loading, router, pathname, publicPaths])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-tyr-navy"></div>
      </div>
    )
  }

  return <>{children}</>
}