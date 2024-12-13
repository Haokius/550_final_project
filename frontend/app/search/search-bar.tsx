import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { SearchCriterion } from './search-criterion'
import { Plus } from 'lucide-react'

interface SearchCriterionType {
  feature: string
  operator: string
  value: string
  logicalOperator: string
}

const initialCriterion: SearchCriterionType = { feature: '', operator: '', value: '', logicalOperator: 'AND' }

export function SearchBar() {
  const [criteria, setCriteria] = useState<SearchCriterionType[]>([initialCriterion])

  const addCriterion = () => {
    setCriteria([...criteria, { ...initialCriterion }])
  }

  const removeCriterion = (index: number) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter((_, i) => i !== index))
    }
  }

  const updateCriterion = (index: number, field: string, value: string) => {
    const newCriteria = criteria.map((criterion, i) => 
      i === index ? { ...criterion, [field]: value } : criterion
    )
    setCriteria(newCriteria)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting search criteria:', criteria)
    try {
      const response = await fetch('http://localhost:8000/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ criteria }),
      })
      const data = await response.json()
      console.log('Search results:', data)
    } catch (error) {
      console.error('Error fetching search results:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {criteria.map((criterion, index) => (
        <SearchCriterion
          key={index}
          index={index}
          criterion={criterion}
          onChange={updateCriterion}
          onRemove={removeCriterion}
          isFirst={index === 0}
        />
      ))}
      <div className="flex justify-between">
        <Button type="button" onClick={addCriterion} variant="outline">
          <Plus className="h-4 w-4 mr-2" /> Add Criterion
        </Button>
        <Button type="submit">Search</Button>
      </div>
    </form>
  )
}

