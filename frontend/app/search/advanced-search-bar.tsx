import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

interface AdvancedSearchBarProps {
  onSearch: (searchParams: Record<string, string>) => void
}

export function AdvancedSearchBar({ onSearch }: AdvancedSearchBarProps) {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '',
    minRating: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setSearchParams((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchParams)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          type="text"
          name="keyword"
          placeholder="Keyword"
          value={searchParams.keyword}
          onChange={handleInputChange}
        />
        <Select name="category" value={searchParams.category} onChange={handleInputChange}>
          <option value="">All Categories</option>
          <option value="Category A">Category A</option>
          <option value="Category B">Category B</option>
        </Select>
        <Input
          type="number"
          name="minRating"
          placeholder="Minimum Rating"
          min="0"
          max="5"
          step="0.1"
          value={searchParams.minRating}
          onChange={handleInputChange}
        />
        <Button type="submit">Search</Button>
      </div>
    </form>
  )
}

