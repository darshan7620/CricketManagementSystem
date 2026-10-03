import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { playerApi } from '../../api.js'
import Message from '../../components/Message.jsx'
import TeamSelect from '../../components/TeamSelect.jsx'

export default function UpdatePlayer() {
  const [params] = useSearchParams()
  const [form, setForm] = useState({
    playerId: params.get('id') || '',
    playerName: '',
    playerRole: 'Batsman',
    jerseyNo: '',
    age: '',
    email: '',
    password: '',
    teamId: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function load(id = form.playerId) {
    setError('')
    try {
      const p = await playerApi.find(id)
      setForm({
        playerId: p.playerId,
        playerName: p.playerName || '',
        playerRole: p.playerRole || 'Batsman',
        jerseyNo: p.jerseyNo ?? '',
        age: p.age ?? '',
        email: p.email || '',
        password: '',
        teamId: p.team?.teamId ?? '',
      })
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (params.get('id')) load(params.get('id'))
  }, [params])

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
      setSuccess(`Updated player ${saved.playerId}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1 className="page-title">Update player</h1>
      <p className="page-sub">Load a player by id, then save changes.</p>
      <div className="card">
        <Message error={error} success={success} />
        <form onSubmit={onSubmit}>
          <label>Player id</label>
          <div className="row">
            <input type="number" required value={form.playerId} onChange={(e) => set('playerId', e.target.value)} />
            <button className="btn btn-ghost" type="button" onClick={() => load()}>Load</button>
          </div>
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
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          <label>New password (optional)</label>
          <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} />
          <button className="btn btn-red" type="submit">Update</button>
        </form>
      </div>
    </>
  )
}
