import { useState } from 'react'
import { teamApi } from '../../api.js'
import Message from '../../components/Message.jsx'

export default function RegisterTeam() {
  const empty = { teamName: '', teamOwner: '', teamCaptain: '' }
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const saved = await teamApi.register(form)
      setSuccess(`Team saved with id ${saved.teamId}`)
      setForm(empty)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
          <div className="form-actions">
            <button className="btn btn-red" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save team'}
            </button>
            <button className="btn btn-ghost" type="button" disabled={loading} onClick={() => setForm(empty)}>
              Reset
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
