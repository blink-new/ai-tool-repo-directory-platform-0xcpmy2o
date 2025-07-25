import { Star, ExternalLink, Github, Heart } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Tool } from '@/types'

interface ToolCardProps {
  tool: Tool
  onViewDetails: (tool: Tool) => void
  onToggleFavorite?: (toolId: string) => void
  isFavorited?: boolean
}

export function ToolCard({ tool, onViewDetails, onToggleFavorite, isFavorited }: ToolCardProps) {
  const handleVisitWebsite = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(tool.website_url, '_blank')
  }

  const handleVisitGithub = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (tool.github_url) {
      window.open(tool.github_url, '_blank')
    }
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onToggleFavorite) {
      onToggleFavorite(tool.id)
    }
  }

  return (
    <Card 
      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm bg-white"
      onClick={() => onViewDetails(tool)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={tool.logo_url} alt={tool.name} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                {tool.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-tight">{tool.name}</h3>
              <Badge variant="secondary" className="mt-1 text-xs">
                {tool.category}
              </Badge>
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
          {tool.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tool.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tool.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tool.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium ml-1">{tool.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({tool.review_count} reviews)
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 flex justify-between">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleVisitWebsite}
            className="flex-1"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Visit
          </Button>
          {tool.github_url && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleVisitGithub}
            >
              <Github className="w-3 h-3" />
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(tool)}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Details
        </Button>
      </CardFooter>
    </Card>
  )
}