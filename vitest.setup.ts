import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

vi.mock('next/navigation', () => ({
  useRouter() {
    return { push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }
  },
  usePathname() { return '/' },
  useSearchParams() { return new URLSearchParams() },
}))

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    React.createElement('img', { src, alt, ...props })
  ),
}))