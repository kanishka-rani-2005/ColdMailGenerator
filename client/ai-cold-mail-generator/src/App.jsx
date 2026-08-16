import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import './styles/auth.css'
import './styles/home.css'

function App() {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null

    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user')
        document.cookie = 'token=; Max-Age=0; path=/; SameSite=Lax'
      }
    }
  }

  return (
    <>
      {user ? <HomePage user={user} onLogout={handleLogout} /> : <AuthPage onLogin={setUser} />}
      <Toaster position="top-right" />
    </>
  )
}

export default App
