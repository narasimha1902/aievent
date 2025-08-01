'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from './button'

interface BackButtonProps {
  href?: string
  onClick?: () => void
  className?: string
}

export function BackButton({ href, onClick, className }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={`absolute top-4 left-4 z-10 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  )
}