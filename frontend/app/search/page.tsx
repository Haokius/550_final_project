'use client'

import { useState } from 'react'
import { AdvancedSearchBar } from './advanced-search-bar'
import { SearchResults } from './search-results'

export interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  rating: number
}

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])

  const handleSearch = async (searchParams: Record<string, string>) => {
    // Simulate API call with setTimeout
    setTimeout(() => {
      const mockResults: SearchResult[] = [
        { id: '1', title: 'Result 1', description: 'Description 1', category: 'Category A', rating: 4.5 },
        { id: '2', title: 'Result 2', description: 'Description 2', category: 'Category B', rating: 3.8 },
        { id: '3', title: 'Result 3', description: 'Description 3', category: 'Category A', rating: 4.2 },
      ]
      setSearchResults(mockResults)
    }, 1000)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Advanced Search</h1>
      <AdvancedSearchBar onSearch={handleSearch} />
      <SearchResults results={searchResults} />
    </div>
  )
}

