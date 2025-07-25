import { useState, useEffect } from 'react'
import { Plus, User, LogOut, Settings, BookOpen, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { blink } from '@/blink/client'
import type { User } from '@/types'

interface HeaderProps {
  onNavigate: (page: string) => void
  currentPage: string
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser({
          id: state.user.id,
          email: state.user.email,
          display_name: state.user.displayName || state.user.email.split('@')[0],
          avatar_url: state.user.avatarUrl,
          role: 'user',
          created_at: new Date().toISOString()
        })
      } else {
        setUser(null)
      }
    })
    return unsubscribe
  }, [])

  const handleLogout = () => {
    blink.auth.logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => onNavigate('home')}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">AI Directory</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Navigation & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Navigation Buttons */}
          <Button
            variant={currentPage === 'home' ? 'default' : 'ghost'}
            onClick={() => onNavigate('home')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Directory
          </Button>

          {user && (
            <>
              <Button
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => onNavigate('dashboard')}
              >
                Dashboard
              </Button>

              <Button
                variant="outline"
                onClick={() => onNavigate('submit')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Submit
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url} alt={user.display_name} />
                      <AvatarFallback>
                        {user.display_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.display_name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('dashboard')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => onNavigate('admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {!user && (
            <Button onClick={() => blink.auth.login()}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}