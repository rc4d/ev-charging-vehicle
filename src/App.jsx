import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

// Pages
import Login from './pages/Login'
import ProfileSetup from './pages/ProfileSetup'
import Home from './pages/Home'
import FindCPO from './pages/FindCPO'
import Sessions from './pages/Sessions'
import Payments from './pages/Payments'
import Settings from './pages/Settings'

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Profile Required Route - for users who need to complete profile
function ProfileRequiredRoute({ children }) {
  const { isAuthenticated, isNewUser, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (isNewUser) {
    return <Navigate to="/profile-setup" replace />
  }
  
  return children
}

// Public Route - redirect to home if already logged in
function PublicRoute({ children }) {
  const { isAuthenticated, isNewUser, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (isAuthenticated) {
    if (isNewUser) {
      return <Navigate to="/profile-setup" replace />
    }
    return <Navigate to="/home" replace />
  }
  
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      
      {/* Profile Setup - requires auth but not profile */}
      <Route 
        path="/profile-setup" 
        element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected Routes - require auth and profile */}
      <Route 
        path="/home" 
        element={
          <ProfileRequiredRoute>
            <Home />
          </ProfileRequiredRoute>
        } 
      />
      
      <Route 
        path="/find-cpo" 
        element={
          <ProfileRequiredRoute>
            <FindCPO />
          </ProfileRequiredRoute>
        } 
      />
      
      <Route 
        path="/sessions" 
        element={
          <ProfileRequiredRoute>
            <Sessions />
          </ProfileRequiredRoute>
        } 
      />
      
      <Route 
        path="/payments" 
        element={
          <ProfileRequiredRoute>
            <Payments />
          </ProfileRequiredRoute>
        } 
      />
      
      <Route 
        path="/settings" 
        element={
          <ProfileRequiredRoute>
            <Settings />
          </ProfileRequiredRoute>
        } 
      />
      
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
