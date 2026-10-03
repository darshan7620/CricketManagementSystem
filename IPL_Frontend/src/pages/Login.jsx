import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { playerApi } from '../api.js'
import { useAuth } from '../auth/AuthContext.jsx'
import Message from '../components/Message.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const player = await playerApi.login({
        email: form.email.trim(),
        password: form.password,
      })
      login(player)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="auth-split">
      <aside className="auth-photo">
        <img src="/images/login-pitch.jpg" alt="Cricket bat and ball on the pitch" />
        <div className="auth-photo-copy">
          <p className="eyebrow">Player gate</p>
          <h2>Back on the park.</h2>
          <p>Sign in with the email saved on your PLAYER record.</p>
        </div>
      </aside>
      <div className="auth-panel fade-up">
        <h1 className="page-title">Log in</h1>
        <p className="page-sub">Separate from sign up — email and password only.</p>
        <div className="card card-sharp">
          <Message error={error} />
          <form onSubmit={onSubmit}>
            <label>Email</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <label>Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button className="btn btn-red btn-block" type="submit">Log in</button>
          </form>
          <p className="page-sub" style={{ marginTop: 16 }}>
            New player? <Link to="/signup">Open the sign up form</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
