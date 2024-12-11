import { QueryResult } from './carousel-query-display'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ResultsDisplayProps {
  results: QueryResult[]
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (results.length === 0) {
    return null
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Results</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {results.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <CardTitle>{result.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

