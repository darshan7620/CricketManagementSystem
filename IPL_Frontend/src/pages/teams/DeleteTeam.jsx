import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { teamApi } from '../../api.js'
import Message from '../../components/Message.jsx'

export default function DeleteTeam() {
  const [params] = useSearchParams()
  const [id, setId] = useState(params.get('id') || '')
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingPreview, setLoadingPreview] = useState(false)

  async function load(teamId) {
    setError('')
    setPreview(null)
    setLoadingPreview(true)
    try {
      setPreview(await teamApi.find(teamId))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingPreview(false)
    }
  }

  useEffect(() => {
    if (params.get('id')) load(params.get('id'))
  }, [params])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    const label = preview?.teamName || `team ${id}`
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return
    setLoading(true)
    try {
      setSuccess(await teamApi.remove(id))
      setPreview(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="page-title">Delete team</h1>
      <p className="page-sub">Removes one TEAM row. Confirm before you continue.</p>
      <div className="card">
        <Message error={error} success={success} />
        <form onSubmit={onSubmit}>
          <label>Team id</label>
          <div className="row">
            <input type="number" required value={id} onChange={(e) => setId(e.target.value)} />
            <button className="btn btn-ghost" type="button" disabled={loadingPreview} onClick={() => load(id)}>
              {loadingPreview ? 'Loading…' : 'Preview'}
            </button>
          </div>
          {preview && <p className="hint">About to delete {preview.teamName} (captain {preview.teamCaptain}).</p>}
          <div className="form-actions">
            <button className="btn btn-danger" type="submit" disabled={loading}>
              {loading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
