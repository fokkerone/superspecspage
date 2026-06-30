import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock usePathname
const mockPathname = vi.fn(() => '/docs/introduction')
vi.mock('next/navigation', () => ({ usePathname: () => mockPathname() }))

import { DocsSidebar } from '@/components/docs/docs-sidebar'

const sampleDocs = [
  { title: 'Introduction', slug: 'docs/introduction', order: 1, section: null },
  { title: 'Quick Start', slug: 'docs/quick-start', order: 2, section: null },
  { title: 'Installation', slug: 'docs/getting-started/installation', order: 1, section: 'getting-started' },
  { title: 'Overview', slug: 'docs/getting-started/overview', order: 2, section: 'getting-started' },
]

describe('DocsSidebar', () => {
  it('(a) renders section label "Getting Started" from kebab-case folder name', () => {
    render(<DocsSidebar docs={sampleDocs} />)
    expect(screen.getByText('Getting Started')).toBeInTheDocument()
  })

  it('(b) section label is NOT wrapped in a link', () => {
    render(<DocsSidebar docs={sampleDocs} />)
    const label = screen.getByText('Getting Started')
    expect(label.closest('a')).toBeNull()
  })

  it('(c) top-level items render as links with correct hrefs', () => {
    render(<DocsSidebar docs={sampleDocs} />)
    const introLink = screen.getByRole('link', { name: 'Introduction' })
    const quickLink = screen.getByRole('link', { name: 'Quick Start' })
    expect(introLink).toHaveAttribute('href', '/docs/introduction')
    expect(quickLink).toHaveAttribute('href', '/docs/quick-start')
  })

  it('(d) active item (pathname matches) has aria-current="page"', () => {
    mockPathname.mockReturnValue('/docs/introduction')
    render(<DocsSidebar docs={sampleDocs} />)
    const activeLink = screen.getByRole('link', { name: 'Introduction' })
    expect(activeLink).toHaveAttribute('aria-current', 'page')
  })

  it('(e) non-active items do NOT have aria-current="page"', () => {
    mockPathname.mockReturnValue('/docs/introduction')
    render(<DocsSidebar docs={sampleDocs} />)
    const nonActiveLink = screen.getByRole('link', { name: 'Quick Start' })
    expect(nonActiveLink).not.toHaveAttribute('aria-current', 'page')
    const installLink = screen.getByRole('link', { name: 'Installation' })
    expect(installLink).not.toHaveAttribute('aria-current', 'page')
  })

  it('(f) Installation (order:1) appears before Overview (order:2) in DOM', () => {
    render(<DocsSidebar docs={sampleDocs} />)
    const links = screen.getAllByRole('link')
    const titles = links.map(l => l.textContent)
    const installIdx = titles.indexOf('Installation')
    const overviewIdx = titles.indexOf('Overview')
    expect(installIdx).toBeLessThan(overviewIdx)
  })

  it('(g) top-level items (section: null) appear without a parent section heading', () => {
    render(<DocsSidebar docs={sampleDocs} />)
    const introLink = screen.getByRole('link', { name: 'Introduction' })
    // Top-level items are direct children of <nav>, not nested inside a section group <div>
    // The immediate parent of a top-level link should be <nav>, not a section wrapper <div>
    const parent = introLink.parentElement
    expect(parent?.tagName.toLowerCase()).toBe('nav')
  })
})
