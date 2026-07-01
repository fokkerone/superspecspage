import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { Callout } from '@/components/docs/callout'

describe('Callout', () => {
  it('(a) renders inside a container with a distinguishing border class', () => {
    render(<Callout>text</Callout>)
    const container = screen.getByTestId('doc-callout')
    expect(container.className).toContain('border')
  })

  it('(b) the container also has a background class', () => {
    render(<Callout>text</Callout>)
    const container = screen.getByTestId('doc-callout')
    expect(container.className).toContain('bg-white')
  })

  it('(c) does not render as a bare <p> element with no wrapping container', () => {
    render(<Callout>text</Callout>)
    const container = screen.getByTestId('doc-callout')
    expect(container.tagName.toLowerCase()).not.toBe('p')
  })

  it('(d) source does not accept a type prop and does not contain forbidden classes', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'components/docs/callout.tsx'),
      'utf-8'
    )
    expect(source).not.toContain('type?:')
    expect(source).not.toContain('type:')
    expect(source).not.toContain('rounded-full')
    expect(source).not.toContain('font-bold')
    expect(source).not.toContain('font-semibold')
  })
})
