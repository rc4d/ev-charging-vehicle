import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'
import ProfileSetup from '../pages/ProfileSetup'

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

const renderProfileSetup = () => {
  // Set up a mock logged-in user first
  localStorage.setItem('ev_user', JSON.stringify({
    phone: '9876543210',
    profileCompleted: false
  }))
  
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProfileSetup />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe('ProfileSetup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders profile setup page', () => {
    renderProfileSetup()
    
    expect(screen.getByText('Complete Your Profile')).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/car brand/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /complete setup/i })).toBeInTheDocument()
  })

  it('shows all car type options', () => {
    renderProfileSetup()
    
    const select = screen.getByLabelText(/car brand/i)
    expect(select).toBeInTheDocument()
    
    // Check for car options
    expect(screen.getByRole('option', { name: /tata/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /mg/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /citroën/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /mahindra/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /maruti suzuki/i })).toBeInTheDocument()
  })

  it('shows error when name is empty', async () => {
    const user = userEvent.setup()
    renderProfileSetup()
    
    await user.click(screen.getByRole('button', { name: /complete setup/i }))
    
    expect(screen.getByText(/name is required/i)).toBeInTheDocument()
  })

  it('shows error when name has invalid characters', async () => {
    const user = userEvent.setup()
    renderProfileSetup()
    
    const nameInput = screen.getByLabelText(/full name/i)
    await user.type(nameInput, 'John123')
    await user.click(screen.getByRole('button', { name: /complete setup/i }))
    
    expect(screen.getByText(/please enter a valid name/i)).toBeInTheDocument()
  })

  it('shows error when car type is not selected', async () => {
    const user = userEvent.setup()
    renderProfileSetup()
    
    const nameInput = screen.getByLabelText(/full name/i)
    await user.type(nameInput, 'John Doe')
    await user.click(screen.getByRole('button', { name: /complete setup/i }))
    
    expect(screen.getByText(/please select your car brand/i)).toBeInTheDocument()
  })

  it('allows form submission with valid data', async () => {
    const user = userEvent.setup()
    renderProfileSetup()
    
    const nameInput = screen.getByLabelText(/full name/i)
    await user.type(nameInput, 'John Doe')
    
    const carSelect = screen.getByLabelText(/car brand/i)
    await user.selectOptions(carSelect, 'tata')
    
    await user.click(screen.getByRole('button', { name: /complete setup/i }))
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home')
    })
  })

  it('saves user data to localStorage on submit', async () => {
    const user = userEvent.setup()
    renderProfileSetup()
    
    const nameInput = screen.getByLabelText(/full name/i)
    await user.type(nameInput, 'Jane Smith')
    
    const carSelect = screen.getByLabelText(/car brand/i)
    await user.selectOptions(carSelect, 'mg')
    
    await user.click(screen.getByRole('button', { name: /complete setup/i }))
    
    await waitFor(() => {
      const storedUser = JSON.parse(localStorage.getItem('ev_user'))
      expect(storedUser.fullName).toBe('Jane Smith')
      expect(storedUser.carType).toBe('mg')
      expect(storedUser.profileCompleted).toBe(true)
    })
  })

  it('has theme toggle button', () => {
    renderProfileSetup()
    
    const themeToggle = screen.getByRole('button', { name: /switch to/i })
    expect(themeToggle).toBeInTheDocument()
  })
})

