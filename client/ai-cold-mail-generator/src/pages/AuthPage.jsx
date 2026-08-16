import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../services/api'

const initialState = {
  name: '',
  email: '',
  password: '',
  otp: '',
}

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [notice, setNotice] = useState('')
  const [pendingUserId, setPendingUserId] = useState('')
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

  const isAuthenticated = Boolean(user)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const resetForm = () => setForm(initialState)

  const handleLogin = async (event) => {
    event.preventDefault()

    if (!form.email || !form.password) {
      toast.error('Please enter your email and password.')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      })

      const userData = response.data
      const nextUser = { _id: userData._id, name: userData.name, email: userData.email }
      setUser(nextUser)
      if (onLogin) onLogin(nextUser)
      setNotice('')
      setPendingUserId('')
      toast.success(userData.message || 'Login successful!')
      resetForm()
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to log in right now.'

      if (message.toLowerCase().includes('verify')) {
        setPendingUserId(error.response?.data?.userId || '')
        setMode('verify')
        setNotice('Your email is not verified yet. Enter the OTP sent to your inbox to continue.')
      }

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (event) => {
    event.preventDefault()

    if (!form.name || !form.email || !form.password) {
      toast.error('Please complete all signup fields.')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      })

      setPendingUserId(response.data.userId || '')
      setNotice('Verification code sent to your email. Enter the 6-digit OTP to activate your account.')
      setMode('verify')
      toast.success(response.data.message || 'Account created successfully.')
      setForm((current) => ({ ...current, password: '' }))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (event) => {
    event.preventDefault()

    if (!pendingUserId || !form.otp) {
      toast.error('Please enter the 6-digit OTP sent to your email.')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/verify-otp', {
        userId: pendingUserId,
        otp: form.otp,
      })

      const userData = response.data
      const nextUser = { _id: userData._id, name: userData.name, email: userData.email }
      setUser(nextUser)
      if (onLogin) onLogin(nextUser)
      setNotice('Email verified successfully. You are now ready to continue.')
      setMode('login')
      toast.success(userData.message || 'Email verified successfully!')
      resetForm()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      setUser(null)
      setNotice('')
      setPendingUserId('')
      setMode('login')
      resetForm()
      toast.success('Logout successful.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed.')
    }
  }

  const onSubmit = mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleVerify

  const pageTitle = mode === 'login' ? ' Login' : mode === 'register' ? ' Signup' : 'Verify Email'
  const pageSubtitle = mode === 'login'
    ? 'Enter your details to get sign in to your account'
    : mode === 'register'
      ? 'Create your agency account and start sending campaigns'
      : 'Enter the 6-digit code that was sent to your inbox'

  return (
    <>
      <div className="app-shell">
        <header className="topbar">
          <div className="brand-wrap">
            <div className="brand-mark" aria-hidden="true" />
            <span className="brand-text">/ Cold@mailer.generator</span>
          </div>

          <div className="top-actions">
            <button
              type="button"
              className="ghost-link"
              onClick={() => {
                setMode((current) => (current === 'login' ? 'register' : 'login'))
                setNotice('')
                resetForm()
              }}
            >
              {mode === 'login' ? 'Signup' : 'Login'}
            </button>

            <button type="button" className="demo-button" onClick={() => {
                    if (mode === 'verify') {
                      setMode('login')
                      setNotice('')
                      setForm(initialState)
                      return
                    }

                    setMode((current) => (current === 'login' ? 'register' : 'login'))
                    setNotice('')
                    resetForm()
                  }}>Get Started</button>
          </div>
        </header>

        <main className="auth-panel">
          <div className="wave wave-one" aria-hidden="true" />
          <div className="wave wave-two" aria-hidden="true" />

          <div className="decor decor-left" aria-hidden="true">
            <div className="face face-one">
              <span className="hair" />
              <span className="eye eye-left" />
              <span className="eye eye-right" />
            </div>
          </div>

          <div className="decor decor-right" aria-hidden="true">
            <div className="paper-plane" />
            <div className="face face-two">
              <span className="hair" />
              <span className="eye eye-left" />
              <span className="eye eye-right" />
            </div>
          </div>

          <section className="auth-card">
            <h1>{pageTitle}</h1>
            <p>{pageSubtitle}</p>

            {notice && <div className="verification-banner">{notice}</div>}

            <form onSubmit={onSubmit} className="auth-form">
              {mode === 'register' && (
                <label className="field-group">
                  <span>Name*</span>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Dstudio Agency Pvt. Ltd."
                  />
                </label>
              )}

              {mode !== 'verify' && (
                <label className="field-group">
                  <span>Email*</span>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="hello@dstudio.digital"
                  />
                </label>
              )}

              {mode !== 'verify' && (
                <label className="field-group">
                  <span>Password*</span>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="••••••••"
                  />
                </label>
              )}

              {mode === 'verify' && (
                <label className="field-group">
                  <span>Verification Code*</span>
                  <input
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="123456"
                  />
                </label>
              )}

              {mode !== 'verify' && (
                <p className="disclaimer">
                  This information will be securely saved as per the <a href="#">Terms of Service</a> &amp; <a href="#">Privacy Policy</a>
                </p>
              )}

              <div className="button-row">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    if (mode === 'verify') {
                      setMode('login')
                      setNotice('')
                      setForm(initialState)
                      return
                    }

                    setMode((current) => (current === 'login' ? 'register' : 'login'))
                    setNotice('')
                    resetForm()
                  }}
                >
                  {mode === 'verify' ? 'Back' : 'Help?'}
                </button>

                <button type="submit" className="primary-btn" disabled={loading}>
                  {loading ? 'Please wait...' : mode === 'login' ? 'Login' : mode === 'register' ? 'Create Account' : 'Verify OTP'}
                </button>
              </div>
            </form>
          </section>

          <footer className="footer-note">Copyright @2026 | Privacy Policy</footer>
        </main>
      </div>
    </>
  )
}

export default AuthPage
