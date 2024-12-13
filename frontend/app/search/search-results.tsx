import { SearchResult } from './page'
import { ResultCard } from './result-card'

interface SearchResultsProps {
  results: SearchResult[]
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result) => (
        <ResultCard key={result.id} result={result} />
      ))}
    </div>
  )
}

