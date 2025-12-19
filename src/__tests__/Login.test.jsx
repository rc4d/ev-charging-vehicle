import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { ThemeProvider } from '../context/ThemeContext'
import Login from '../pages/Login'

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('renders login page with phone input by default', () => {
    renderLogin()
    
    expect(screen.getByText('EV Charge')).toBeInTheDocument()
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send otp/i })).toBeInTheDocument()
  })

  it('can switch between phone and email login', async () => {
    const user = userEvent.setup()
    renderLogin()
    
    // Default is phone
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    
    // Switch to email
    await user.click(screen.getByRole('button', { name: /email/i }))
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    
    // Switch back to phone
    await user.click(screen.getByRole('button', { name: /phone/i }))
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
  })

  it('shows error for invalid phone number', async () => {
    const user = userEvent.setup()
    renderLogin()
    
    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, '123')
    await user.click(screen.getByRole('button', { name: /send otp/i }))
    
    expect(screen.getByText(/please enter a valid indian mobile number/i)).toBeInTheDocument()
  })

  it('shows error for invalid email', async () => {
    const user = userEvent.setup()
    renderLogin()
    
    // Switch to email by clicking the Email tab  
    const buttons = screen.getAllByRole('button')
    const emailTab = buttons.find(btn => btn.textContent === 'Email')
    await user.click(emailTab)
    
    // Wait for the email input to appear
    const emailInput = await screen.findByLabelText(/email address/i)
    
    await user.type(emailInput, 'invalidemail')
    
    // Submit the form
    const form = emailInput.closest('form')
    fireEvent.submit(form)
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/please enter a valid email/i)
    })
  })

  it('proceeds to OTP screen with valid phone number', async () => {
    const user = userEvent.setup()
    renderLogin()
    
    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, '9876543210')
    await user.click(screen.getByRole('button', { name: /send otp/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/enter otp/i)).toBeInTheDocument()
    })
  })

  it('proceeds to OTP screen with valid email', async () => {
    const user = userEvent.setup()
    renderLogin()
    
    // Switch to email
    await user.click(screen.getByRole('button', { name: /email/i }))
    
    const emailInput = screen.getByLabelText(/email address/i)
    await user.type(emailInput, 'test@example.com')
    await user.click(screen.getByRole('button', { name: /send otp/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/enter otp/i)).toBeInTheDocument()
    })
  })

  it('shows back button on OTP screen and can go back', async () => {
    const user = userEvent.setup()
    renderLogin()
    
    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, '9876543210')
    await user.click(screen.getByRole('button', { name: /send otp/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/enter otp/i)).toBeInTheDocument()
    })
    
    await user.click(screen.getByRole('button', { name: /back/i }))
    
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
  })

  it('validates OTP input', async () => {
    const user = userEvent.setup()
    renderLogin()
    
    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, '9876543210')
    await user.click(screen.getByRole('button', { name: /send otp/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/enter otp/i)).toBeInTheDocument()
    })
    
    const otpInput = screen.getByLabelText(/verification code/i)
    await user.type(otpInput, '12')
    await user.click(screen.getByRole('button', { name: /verify/i }))
    
    expect(screen.getByText(/please enter a valid 4-digit otp/i)).toBeInTheDocument()
  })

  it('has theme toggle button', () => {
    renderLogin()
    
    const themeToggle = screen.getByRole('button', { name: /switch to/i })
    expect(themeToggle).toBeInTheDocument()
  })
})

