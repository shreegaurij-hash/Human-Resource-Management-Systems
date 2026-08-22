/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react'
import { QuickAccessCard } from '../QuickAccessCard'
import { Users } from 'lucide-react'

describe('QuickAccessCard', () => {
  it('renders the title and value', () => {
    render(
      <QuickAccessCard
        title="Total Headcount"
        value="2,451"
        icon={Users}
      />
    )

    expect(screen.getByText('Total Headcount')).toBeInTheDocument()
    expect(screen.getByText('2,451')).toBeInTheDocument()
  })

  it('renders the trend indicator if provided', () => {
    render(
      <QuickAccessCard
        title="Total Headcount"
        value="2,451"
        icon={Users}
        trend={{ value: 12, isPositive: true }}
        description="vs last month"
      />
    )

    expect(screen.getByText('+12%')).toBeInTheDocument()
    expect(screen.getByText('vs last month')).toBeInTheDocument()
  })
})
