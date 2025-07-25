import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { HomePage } from '@/pages/HomePage'
import { Toaster } from '@/components/ui/toaster'
import { blink } from '@/blink/client'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (currentPage !== 'home') {
      setCurrentPage('home')
    }
  }

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    if (page === 'home') {
      setSearchQuery('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Loading AI Directory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header 
        onSearch={handleSearch}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
      
      <main className="min-h-[calc(100vh-4rem)]">
        {currentPage === 'home' && (
          <HomePage searchQuery={searchQuery} />
        )}
        
        {currentPage === 'dashboard' && user && (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
              <p className="text-muted-foreground">Coming soon! Manage your submissions and favorites here.</p>
            </div>
          </div>
        )}
        
        {currentPage === 'submit' && user && (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Submit Tool or Repository</h1>
              <p className="text-muted-foreground">Coming soon! Submit your AI tools and repositories for review.</p>
            </div>
          </div>
        )}
        
        {currentPage === 'profile' && user && (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">User Profile</h1>
              <p className="text-muted-foreground">Coming soon! Manage your profile and settings.</p>
            </div>
          </div>
        )}
        
        {currentPage === 'admin' && user && (
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
              <p className="text-muted-foreground">Coming soon! Manage users, content, and platform settings.</p>
            </div>
          </div>
        )}
      </main>
      
      <Toaster />
    </div>
  )
}

export default App