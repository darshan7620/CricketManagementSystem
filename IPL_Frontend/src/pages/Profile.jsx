import { useState } from 'react'
import { playerApi } from '../api.js'
import { useAuth } from '../auth/AuthContext.jsx'
import Message from '../components/Message.jsx'
import TeamSelect from '../components/TeamSelect.jsx'

export default function Profile() {
  const { player, login } = useAuth()
  const [form, setForm] = useState({
    playerId: player?.playerId || '',
    playerName: player?.playerName || '',
    playerRole: player?.playerRole || 'Batsman',
    jerseyNo: player?.jerseyNo ?? '',
    age: player?.age ?? '',
    email: player?.email || '',
    password: '',
    teamId: player?.team?.teamId ?? '',
  })
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
        playerId: Number(form.playerId),
        playerName: form.playerName,
        playerRole: form.playerRole,
        jerseyNo: Number(form.jerseyNo),
        age: Number(form.age),
        email: form.email || undefined,
      }
      if (form.password) body.password = form.password
      if (form.teamId) body.team = { teamId: Number(form.teamId) }
      const saved = await playerApi.update(body)
      login(saved)
      setSuccess('Profile saved')
      set('password', '')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1 className="page-title">My profile</h1>
      <p className="page-sub">Edit the PLAYER row tied to this login.</p>
      <div className="card card-sharp">
        <Message error={error} success={success} />
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
              <label>Jersey</label>
              <input type="number" required value={form.jerseyNo} onChange={(e) => set('jerseyNo', e.target.value)} />
            </div>
            <div>
              <label>Age</label>
              <input type="number" required value={form.age} onChange={(e) => set('age', e.target.value)} />
            </div>
          </div>
          <label>Franchise</label>
          <TeamSelect value={form.teamId} onChange={(v) => set('teamId', v)} />
          <label>New password (optional)</label>
          <input type="password" minLength={4} value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Leave blank to keep current" />
          <button className="btn btn-red" type="submit">Save profile</button>
        </form>
      </div>
    </>
  )
}
