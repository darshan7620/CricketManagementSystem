import { useState } from 'react'
import { teamApi } from '../../api.js'
import Message from '../../components/Message.jsx'

export default function RegisterTeam() {
  const [form, setForm] = useState({ teamName: '', teamOwner: '', teamCaptain: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const saved = await teamApi.register(form)
      setSuccess(`Team saved with id ${saved.teamId}`)
      setForm({ teamName: '', teamOwner: '', teamCaptain: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1 className="page-title">Register team</h1>
      <p className="page-sub">Add a franchise. Players can pick it from the team list after this.</p>
      <div className="card">
        <Message error={error} success={success} />
        <form onSubmit={onSubmit}>
          <label>Team name</label>
          <input required value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} />
          <label>Owner</label>
          <input required value={form.teamOwner} onChange={(e) => setForm({ ...form, teamOwner: e.target.value })} />
          <label>Captain</label>
          <input required value={form.teamCaptain} onChange={(e) => setForm({ ...form, teamCaptain: e.target.value })} />
          <button className="btn btn-red" type="submit">Save team</button>
        </form>
      </div>
    </>
  )
}
