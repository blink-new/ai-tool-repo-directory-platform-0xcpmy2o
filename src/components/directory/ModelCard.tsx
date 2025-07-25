import { Star, Download, ExternalLink, FileText, Play } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Model } from '@/types'

interface ModelCardProps {
  model: Model
  isListView?: boolean
}

export function ModelCard({ model, isListView = false }: ModelCardProps) {
  const tags = Array.isArray(model.tags) ? model.tags : JSON.parse(model.tags || '[]')

  if (isListView) {
    return (
      <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-indigo-500">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-100 to-purple-100">
              {model.image_url ? (
                <img 
                  src={model.image_url} 
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-indigo-600" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{model.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {model.model_type}
                    </Badge>
                    {model.parameters && (
                      <Badge variant="outline" className="text-xs">
                        {model.parameters}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{model.rating.toFixed(1)}</span>
                    <span className="text-gray-400">({model.review_count})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{model.download_count.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{model.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {tags.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {model.demo_url && (
                    <Button size="sm" variant="outline" className="h-8">
                      <Play className="w-3 h-3 mr-1" />
                      Demo
                    </Button>
                  )}
                  {model.huggingface_url && (
                    <Button size="sm" variant="outline" className="h-8">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      HuggingFace
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md bg-white">
      <div className="relative overflow-hidden rounded-t-lg">
        <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100">
          {model.image_url ? (
            <img 
              src={model.image_url} 
              alt={model.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-12 h-12 text-indigo-600" />
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-indigo-700 hover:bg-white">
            {model.model_type}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {model.name}
            </h3>
            {model.parameters && (
              <Badge variant="outline" className="mt-1 text-xs">
                {model.parameters}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{model.rating.toFixed(1)}</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{model.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Download className="w-4 h-4" />
            <span>{model.download_count.toLocaleString()} downloads</span>
          </div>
          <span>{model.review_count} reviews</span>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <div className="flex gap-2 w-full">
          {model.demo_url && (
            <Button size="sm" variant="outline" className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Demo
            </Button>
          )}
          {model.huggingface_url && (
            <Button size="sm" variant="outline" className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              HuggingFace
            </Button>
          )}
          {model.paper_url && (
            <Button size="sm" variant="outline" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Paper
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}