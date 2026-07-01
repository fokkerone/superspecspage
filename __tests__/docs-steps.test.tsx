import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { Steps, Step } from '@/components/docs/steps'

describe('Steps / Step', () => {
  it('(a) renders both step titles', () => {
    render(
      <Steps>
        <Step title="Discuss">text one</Step>
        <Step title="Plan">text two</Step>
      </Steps>
    )
    expect(screen.getByText('Discuss')).toBeInTheDocument()
    expect(screen.getByText('Plan')).toBeInTheDocument()
  })

  it('(b) each step is a distinct DOM node', () => {
    render(
      <Steps>
        <Step title="Discuss">text one</Step>
        <Step title="Plan">text two</Step>
      </Steps>
    )
    const stepNodes = screen.getAllByTestId('doc-step')
    expect(stepNodes).toHaveLength(2)
    expect(stepNodes[0]).not.toBe(stepNodes[1])
  })

  it('(c) source does not contain forbidden classes', () => {
    const source = readFileSync(
      path.join(process.cwd(), 'components/docs/steps.tsx'),
      'utf-8'
    )
    expect(source).not.toContain('rounded-full')
    expect(source).not.toContain('font-bold')
    expect(source).not.toContain('font-semibold')
  })
})
