import { Star, ExternalLink, Github, GitFork, Heart } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Repository } from '@/types'

interface RepositoryCardProps {
  repository: Repository
  onViewDetails: (repository: Repository) => void
  onToggleFavorite?: (repoId: string) => void
  isFavorited?: boolean
}

export function RepositoryCard({ repository, onViewDetails, onToggleFavorite, isFavorited }: RepositoryCardProps) {
  const handleVisitGithub = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(repository.github_url, '_blank')
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleFavorite) {
      onToggleFavorite(repository.id)
    }
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'JavaScript': 'bg-yellow-500',
      'TypeScript': 'bg-blue-500',
      'Python': 'bg-green-500',
      'Java': 'bg-red-500',
      'C++': 'bg-purple-500',
      'Go': 'bg-cyan-500',
      'Rust': 'bg-orange-500',
      'Swift': 'bg-orange-400',
      'Kotlin': 'bg-purple-400',
      'PHP': 'bg-indigo-500',
    }
    return colors[language] || 'bg-gray-500'
  }

  return (
    <Card 
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm bg-white"
      onClick={() => onViewDetails(repository)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              {repository.image_url ? (
                <img src={repository.image_url} alt={repository.name} className="w-full h-full object-cover" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white font-semibold">
                  <Github className="w-6 h-6" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{repository.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {repository.category}
                </Badge>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${getLanguageColor(repository.language)}`} />
                  <span className="text-xs text-muted-foreground">{repository.language}</span>
                </div>
              </div>
            </div>
          </div>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {repository.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {repository.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {repository.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{repository.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{repository.stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitFork className="w-4 h-4" />
            <span>{repository.forks.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{repository.rating.toFixed(1)} ({repository.review_count})</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleVisitGithub}
          className="flex-1 mr-2"
        >
          <Github className="w-3 h-3 mr-1" />
          View on GitHub
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(repository)}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  )
}