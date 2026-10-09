import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { teamApi } from '../../api.js'
import Message from '../../components/Message.jsx'

export default function UpdateTeam() {
  const [params] = useSearchParams()
  const [form, setForm] = useState({
    teamId: params.get('id') || '',
    teamName: '',
    teamOwner: '',
    teamCaptain: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(false)

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function load(id = form.teamId) {
    setError('')
    setLoadingData(true)
    try {
      const t = await teamApi.find(id)
      setForm({
        teamId: t.teamId,
        teamName: t.teamName || '',
        teamOwner: t.teamOwner || '',
        teamCaptain: t.teamCaptain || '',
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (params.get('id')) load(params.get('id'))
  }, [params])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const saved = await teamApi.update({
        teamId: Number(form.teamId),
        teamName: form.teamName,
        teamOwner: form.teamOwner,
        teamCaptain: form.teamCaptain,
      })
      setSuccess(`Updated team ${saved.teamId}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="page-title">Update team</h1>
      <p className="page-sub">Load a franchise by id, then save changes.</p>
      <div className="card">
        <Message error={error} success={success} />
        <form onSubmit={onSubmit}>
          <label>Team id</label>
          <div className="row">
            <input type="number" required value={form.teamId} onChange={(e) => set('teamId', e.target.value)} />
            <button className="btn btn-ghost" type="button" disabled={loadingData} onClick={() => load()}>
              {loadingData ? 'Loading…' : 'Load'}
            </button>
          </div>
          <label>Name</label>
          <input required value={form.teamName} onChange={(e) => set('teamName', e.target.value)} />
          <label>Owner</label>
          <input required value={form.teamOwner} onChange={(e) => set('teamOwner', e.target.value)} />
          <label>Captain</label>
          <input required value={form.teamCaptain} onChange={(e) => set('teamCaptain', e.target.value)} />
          <div className="form-actions">
            <button className="btn btn-red" type="submit" disabled={loading}>
              {loading ? 'Updating…' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
