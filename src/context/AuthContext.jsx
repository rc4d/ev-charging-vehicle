import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'ev_user'
const REGISTERED_USERS_KEY = 'ev_registered_users'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isNewUser, setIsNewUser] = useState(false)

  useEffect(() => {
    // Check localStorage for existing user on mount
    const storedUser = localStorage.getItem(STORAGE_KEY)
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        // Check if user has completed profile setup
        setIsNewUser(!parsedUser.profileCompleted)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const login = (credential, type) => {
    // Check registered users registry (persists across logouts)
    const registeredUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY)
    const registeredUsers = registeredUsersRaw ? JSON.parse(registeredUsersRaw) : {}
    const userKey = `${type}:${credential}`
    
    if (registeredUsers[userKey]) {
      // Existing user - restore their data
      const existingUser = registeredUsers[userKey]
      setUser(existingUser)
      setIsNewUser(!existingUser.profileCompleted)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUser))
      return { success: true, isNewUser: !existingUser.profileCompleted }
    }
    
    // New user - create basic user object
    const newUser = {
      [type]: credential,
      profileCompleted: false,
      createdAt: new Date().toISOString()
    }
    
    setUser(newUser)
    setIsNewUser(true)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    
    return { success: true, isNewUser: true }
  }

  const completeProfile = (profileData) => {
    const updatedUser = {
      ...user,
      ...profileData,
      profileCompleted: true,
      updatedAt: new Date().toISOString()
    }
    
    setUser(updatedUser)
    setIsNewUser(false)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
    
    // Also save to registered users registry (persists across logouts)
    const registeredUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY)
    const registeredUsers = registeredUsersRaw ? JSON.parse(registeredUsersRaw) : {}
    const userKey = updatedUser.phone ? `phone:${updatedUser.phone}` : `email:${updatedUser.email}`
    registeredUsers[userKey] = updatedUser
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers))
    
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    setIsNewUser(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  const updateUser = (updates) => {
    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    setUser(updatedUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser))
  }

  const value = {
    user,
    isLoading,
    isNewUser,
    isAuthenticated: !!user,
    login,
    logout,
    completeProfile,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
