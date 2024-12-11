'use client'

import * as React from 'react'
import { CarouselOptions } from './carousel-options'
import { QueryPopup } from './query-popup'
import { ResultsDisplay } from './results-display'

export interface QueryOption {
  id: string
  title: string
  description: string
}

export interface QueryResult {
  id: string
  title: string
  content: string
}

// NOTE: some of these are not right or simple
const queryOptions: QueryOption[] = [
  { id: '1', title: 'Get Top Stocks', description: 'This query calculates the highest, lowest, and average closing prices for each stock, then ranks stocks by their average closing price and selects the top 10 stocks matching this criteria.' },
  { id: '2', title: 'Get Companies with High Cash and Minimal Debt', description: 'This query identifies companies with substantial cash reserves (over $50 million) and minimal long-term debt (under $10 million), then retrieves the highest recorded closing price for each companys stock.' },
  { id: '3', title: 'Get Best Months for Stocks', description: 'This query calculates the monthly average close for each stock and ranks these averages in descending order, selecting the top 10 months with the highest average close prices.' },
  { id: '4', title: 'Get Highest Fluctutations', description: 'This query calculates the average monthly volatility for high-volume stocks, showing the top 10 months with the highest price fluctuations.' },
  { id: '5', title: 'Get Highest Liquidity Debt Ratio', description: 'This query identifies the top 10 companies with the highest cash-to-debt ratios, providing insights into their liquidity and financial stability.' },
  { id: '6', title: 'Get Greatest Leverage Differences', description: 'Discover new cooking recipes' },
  { id: '7', title: 'Travel', description: 'Explore travel destinations' },
  { id: '8', title: 'Books', description: 'Search for book recommendations' },
  { id: '9', title: 'Jobs', description: 'Browse job listings' },
  { id: '10', title: 'Events', description: 'Find upcoming events' },
]

export function CarouselQueryDisplay() {
  const [selectedOption, setSelectedOption] = React.useState<QueryOption | null>(null)
  const [isPopupOpen, setIsPopupOpen] = React.useState(false)
  const [results, setResults] = React.useState<QueryResult[]>([])

  const handleOptionClick = (option: QueryOption) => {
    setSelectedOption(option)
    setIsPopupOpen(true)
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setSelectedOption(null)
  }

  const handleSubmitQuery = async (queryId: string) => {
    // Simulate API call with setTimeout
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockResults: QueryResult[] = [
      { id: '1', title: 'Result 1', content: `${selectedOption?.title}` },
      { id: '2', title: 'Result 2', content: 'Sample content for result 2' },
      { id: '3', title: 'Result 3', content: 'Sample content for result 3' },
    ]

    console.log("query id: ", queryId);

    setResults(mockResults)
    setIsPopupOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Query Options</h1>
      <CarouselOptions options={queryOptions} onOptionClick={handleOptionClick} />
      <QueryPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSubmit={handleSubmitQuery}
        option={selectedOption}
      />
      <ResultsDisplay results={results} />
    </div>
  )
}

