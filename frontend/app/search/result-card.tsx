import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { SearchResult } from './page'

interface ResultCardProps {
  result: SearchResult
}

export function ResultCard({ result }: ResultCardProps) {
  const handleClick = () => {
    // Handle card click, e.g., navigate to detail page or open modal
    console.log('Clicked result:', result)
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleClick}>
      <CardHeader>
        <CardTitle>{result.title}</CardTitle>
        <CardDescription>{result.category}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{result.description}</p>
        <div className="mt-2 flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          <span>{result.rating.toFixed(1)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

