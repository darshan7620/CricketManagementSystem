import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminApi } from '../api.js'
import { useAuth } from '../auth/AuthContext.jsx'
import Message from '../components/Message.jsx'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const admin = await adminApi.login({
        email: form.email.trim(),
        password: form.password,
      })
      login(admin)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-split">
      <aside className="auth-photo">
        <img src="/images/dashboard-night.jpg" alt="Floodlit cricket stadium at night" />
        <div className="auth-photo-copy">
          <p className="eyebrow">Control room</p>
          <h2>Administrator access.</h2>
          <p>Restricted console for franchise and squad operations.</p>
        </div>
      </aside>
      <div className="auth-panel fade-up">
        <h1 className="page-title">Admin log in</h1>
        <p className="page-sub">Administrator accounts only. There is no public admin sign up.</p>
        <div className="card card-sharp">
          <Message error={error} />
          <form onSubmit={onSubmit}>
            <label>Email</label>
            <input
              type="email"
              required
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label>Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button className="btn btn-red btn-block" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in as admin'}
            </button>
          </form>
          <p className="page-sub" style={{ marginTop: 16 }}>
            Player instead? <Link to="/login">Open the player login</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
