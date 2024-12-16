'use client'

import * as React from 'react'
import { CarouselOptions } from './carousel-options'
import { QueryPopup } from './query-popup'
import { ResultsDisplay } from './results-display'

import axios from 'axios'
import { ShuffleIcon } from 'lucide-react'


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

const queryOptions: QueryOption[] = [
  { id: '1', title: 'Get Companies with Significant Financial Improvement', description: "This query identifies companies with significant financial improvement over two years, specifically those that have increased cash reserves by more than 5% and reduced long-term debt by more than 5%."},
  { id: '2', title: 'Get Companies with Best Debt to Asset Ratio', description: "This query calculates the debt-to-asset ratio for each company and joins it with stock price data to analyze average volatility."},
  { id: '3', title: 'Get Advanced Trading Metrics of Companies', description: 'This query returns advanced trading metrics of companies, including volatility, average daily range, upper half closes, VWAP, month price change, and quick ratio.'},
  { id: '4', title: 'Get Pairs of Companies with Similar Inventory Ratios', description: "This query calculates the inventory-to-asset and cash-to-liability ratios for companies, filters for those with significant cash liquidity, and performs cross-comparisons between companies to find pairs with similar inventory-to-asset ratios."},
]

export function CarouselQueryDisplay() {
  const [selectedOption, setSelectedOption] = React.useState<QueryOption | null>(null)
  const [isPopupOpen, setIsPopupOpen] = React.useState(false)
  const [results, setResults] = React.useState<QueryResult[]>([])

  const clearResults = () => {
    setResults([]);
  }

  const handleOptionClick = (option: QueryOption) => {
    setSelectedOption(option)
    setIsPopupOpen(true)
    clearResults()
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setSelectedOption(null)
  }

  const handleSubmitQuery = async (queryId: string | undefined) => {
    if (!queryId) {
        console.error("Query ID is undefined");
        return;
    }

    const queryUrlMap = {
      '1': "/companies/financial_improvement",
      '2': "/companies/debt_to_asset_ratio",
      '3': "/stock/advanced-trading-metrics",
      '4': "/companies/similar_inventory_ratios",
    };

    try {
        const suffixUrl = queryUrlMap[queryId as keyof typeof queryUrlMap]
        const response = await axios.get(`http://localhost:8000/api${suffixUrl}`)
        const data = response.data
        setResults(data)
    } catch (err) {
        console.error("Failed to fetch data:", err);
        alert("An error occurred while fetching data. Please try again later.");
    }
    setIsPopupOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Complex Query Options</h1>
      <p className="mb-4">Browse through our curated selection of complex financial queries to gain insights into the market. From top-performing stocks to companies with strong liquidity, our queries are designed to help you make informed decisions.</p>
      <CarouselOptions
        options={queryOptions}
        onOptionClick={handleOptionClick}
        onOptionChange={clearResults}
        />
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

export default CarouselQueryDisplay

