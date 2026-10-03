import { useState } from 'react'
import { playerApi } from '../../api.js'
import Message from '../../components/Message.jsx'
import TeamSelect from '../../components/TeamSelect.jsx'

const empty = {
  playerName: '',
  playerRole: 'Batsman',
  jerseyNo: '',
  age: '',
  email: '',
  password: '',
  teamId: '',
}

export default function RegisterPlayer() {
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const body = {
        playerName: form.playerName,
        playerRole: form.playerRole,
        jerseyNo: Number(form.jerseyNo),
        age: Number(form.age),
        email: form.email || undefined,
        password: form.password || undefined,
      }
      if (form.teamId) body.team = { teamId: Number(form.teamId) }
      const saved = await playerApi.register(body)
      setSuccess(`Player saved with id ${saved.playerId}`)
      setForm(empty)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1 className="page-title">Register player</h1>
      <p className="page-sub">Add a squad member. Franchise is optional.</p>
      <div className="card">
        <Message error={error} success={success} />
        <form onSubmit={onSubmit}>
          <div className="grid-2">
            <div>
              <label>Name</label>
              <input required value={form.playerName} onChange={(e) => set('playerName', e.target.value)} />
            </div>
            <div>
              <label>Role</label>
              <select value={form.playerRole} onChange={(e) => set('playerRole', e.target.value)}>
                <option>Batsman</option>
                <option>Bowler</option>
                <option>All-rounder</option>
                <option>Wicket-keeper</option>
              </select>
            </div>
          </div>
          <div className="grid-3">
            <div>
              <label>Jersey</label>
              <input type="number" required value={form.jerseyNo} onChange={(e) => set('jerseyNo', e.target.value)} />
            </div>
            <div>
              <label>Age</label>
              <input type="number" required value={form.age} onChange={(e) => set('age', e.target.value)} />
            </div>
            <div>
              <label>Franchise</label>
              <TeamSelect value={form.teamId} onChange={(v) => set('teamId', v)} />
            </div>
          </div>
          <div className="grid-2">
            <div>
              <label>Login email (optional)</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </div>
            <div>
              <label>Login password (optional)</label>
              <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} />
            </div>
          </div>
          <button className="btn btn-red" type="submit">Save player</button>
        </form>
      </div>
    </>
  )
}
