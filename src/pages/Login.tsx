import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import '../Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t } = useLanguage()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = await login(username, password)
      if (!success) {
        setError(t('login.invalidCredentials'))
      }
    } catch {
      setError(t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  const handleSSO = () => {
    // SSO integration placeholder
    console.log('SSO login clicked')
  }

  return (
    <div className="login-container">
      {/* ── Left panel ── */}
      <section className="login-background">
        <img src="/background.jpg" alt="Background" className="login-bg-image" />
        <div className="login-overlay" />
        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-title">{t('login.brandTitle')}</div>
            <p className="login-subtitle">
              {t('login.brandDesc')}
            </p>
          </div>
          <div className="login-version">© 2026 Cove — v2.4.1</div>
        </div>
        <div className="login-dots">
          {Array.from({ length: 25 }).map((_, i) => <span key={i} />)}
        </div>
      </section>

      {/* ── Right panel ── */}
      <section className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <h2>{t('login.title')}</h2>
            <p>{t('login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="login-error">{error}</div>}

            <div className="login-field">
              <label htmlFor="username">{t('login.username')}</label>
              <div className="login-input-wrapper">
                <User size={18} className="login-input-icon" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('login.usernamePlaceholder')}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">{t('login.password')}</label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('login.passwordPlaceholder')}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="login-row-meta">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {t('login.rememberMe')}
              </label>
              <a href="#" className="login-forgot">{t('login.forgotPassword')}</a>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? t('login.submitting') : t('login.submit')}
            </button>
          </form>

          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">{t('login.or')}</span>
            <div className="login-divider-line" />
          </div>

          <button type="button" className="login-sso-btn" onClick={handleSSO}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            {t('login.sso')}
          </button>

          <p className="login-form-footer">
            {t('login.newUser')} <a href="#">{t('login.requestAccess')}</a>
          </p>
        </div>
      </section>
    </div>
  )
}
