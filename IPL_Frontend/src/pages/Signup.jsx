import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { playerApi } from '../api.js'
import { useAuth } from '../auth/AuthContext.jsx'
import Message from '../components/Message.jsx'
import TeamSelect from '../components/TeamSelect.jsx'
import { validatePassword } from '../utils/passwordPolicy.js'

export default function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    playerName: '',
    email: '',
    password: '',
    playerRole: 'Batsman',
    jerseyNo: '',
    age: '',
    teamId: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const issue = validatePassword(form.password)
    if (issue) {
      setError(issue)
      return
    }
    setLoading(true)
    try {
      // Role is never sent by the client; the server always creates a PLAYER.
      const body = {
        playerName: form.playerName,
        email: form.email.trim(),
        password: form.password,
        playerRole: form.playerRole,
        jerseyNo: Number(form.jerseyNo),
        age: Number(form.age),
      }
      if (form.teamId) {
        body.team = { teamId: Number(form.teamId) }
      }
      const player = await playerApi.signup(body)
      login(player)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-split auth-split-flip">
      <aside className="auth-photo">
        <img src="/images/signup-crowd.jpg" alt="Packed cricket stadium" />
        <div className="auth-photo-copy">
          <p className="eyebrow">New contract</p>
          <h2>Join the squad.</h2>
          <p>Creates a hashed password on a PLAYER row. Team id is optional.</p>
        </div>
      </aside>
      <div className="auth-panel fade-up">
        <h1 className="page-title">Sign up</h1>
        <p className="page-sub">Full player profile — not the login form.</p>
        <div className="card card-sharp">
          <Message error={error} />
          <form onSubmit={onSubmit}>
            <div className="grid-2">
              <div>
                <label>Full name</label>
                <input required value={form.playerName} onChange={(e) => set('playerName', e.target.value)} />
              </div>
              <div>
                <label>Email</label>
                <input type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
              </div>
            </div>
            <label>Password</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
            />
            <p className="hint" style={{ marginTop: -8 }}>
              At least 8 characters with an uppercase, lowercase, digit and special character.
            </p>
            <div className="grid-3">
              <div>
                <label>Role</label>
                <select value={form.playerRole} onChange={(e) => set('playerRole', e.target.value)}>
                  <option>Batsman</option>
                  <option>Bowler</option>
                  <option>All-rounder</option>
                  <option>Wicket-keeper</option>
                </select>
              </div>
              <div>
                <label>Jersey no</label>
                <input type="number" required value={form.jerseyNo} onChange={(e) => set('jerseyNo', e.target.value)} />
              </div>
              <div>
                <label>Age</label>
                <input type="number" required value={form.age} onChange={(e) => set('age', e.target.value)} />
              </div>
            </div>
            <label>Franchise (optional)</label>
            <TeamSelect value={form.teamId} onChange={(v) => set('teamId', v)} />
            <button className="btn btn-red btn-block" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
          <p className="page-sub" style={{ marginTop: 16 }}>
            Already registered? <Link to="/login">Open the login form</Link>
          </p>
          <p className="page-sub" style={{ marginTop: 8 }}>
            Administrator? <Link to="/admin/login">Sign in to the admin console</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
