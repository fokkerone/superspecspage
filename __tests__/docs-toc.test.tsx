import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { DocsTOC } from '@/components/docs/docs-toc'

const sampleToc = [
  { title: 'Introduction', id: 'introduction', depth: 2 },
  { title: 'Sub Section', id: 'sub-section', depth: 3 },
  { title: 'Another H2', id: 'another-h2', depth: 2 },
]

describe('DocsTOC', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('(a) renders nothing when toc is empty', () => {
    const { container } = render(<DocsTOC toc={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('(b) renders "On this page" label when toc is non-empty', () => {
    render(<DocsTOC toc={sampleToc} />)
    expect(screen.getByText('On this page')).toBeTruthy()
  })

  it('(c) each entry has href="#<id>" attribute', () => {
    render(<DocsTOC toc={sampleToc} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
    expect(links[0]).toHaveAttribute('href', '#introduction')
    expect(links[1]).toHaveAttribute('href', '#sub-section')
    expect(links[2]).toHaveAttribute('href', '#another-h2')
  })

  it('(d) H3 entry has indent class that H2 entries do NOT have', () => {
    render(<DocsTOC toc={sampleToc} />)
    const links = screen.getAllByRole('link')
    const h2Link = links[0] // depth 2
    const h3Link = links[1] // depth 3
    const anotherH2Link = links[2] // depth 2

    // H3 should have pl-3 class
    expect(h3Link.className).toContain('pl-3')
    // H2 entries should NOT have pl-3 class
    expect(h2Link.className).not.toContain('pl-3')
    expect(anotherH2Link.className).not.toContain('pl-3')
  })

  it('(e) clicking an entry calls scrollIntoView on the matching element', () => {
    const mockScrollIntoView = vi.fn()
    vi.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    } as unknown as HTMLElement)

    render(<DocsTOC toc={sampleToc} />)
    const links = screen.getAllByRole('link')
    fireEvent.click(links[0])

    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })

  it('(f) clicking an entry calls e.preventDefault() — link does not navigate natively', () => {
    const mockScrollIntoView = vi.fn()
    vi.spyOn(document, 'getElementById').mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    } as unknown as HTMLElement)

    render(<DocsTOC toc={sampleToc} />)
    const links = screen.getAllByRole('link')

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')

    links[0].dispatchEvent(clickEvent)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })
})
