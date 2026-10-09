import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { playerApi } from '../../api.js'
import Message from '../../components/Message.jsx'

export default function DeletePlayer() {
  const [params] = useSearchParams()
  const [id, setId] = useState(params.get('id') || '')
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingPreview, setLoadingPreview] = useState(false)

  async function load(playerId) {
    setError('')
    setPreview(null)
    setLoadingPreview(true)
    try {
      setPreview(await playerApi.find(playerId))
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
    const label = preview?.playerName || `player ${id}`
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return
    setLoading(true)
    try {
      setSuccess(await playerApi.remove(id))
      setPreview(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="page-title">Delete player</h1>
      <p className="page-sub">Removes one PLAYER row. Confirm before you continue.</p>
      <div className="card">
        <Message error={error} success={success} />
        <form onSubmit={onSubmit}>
          <label>Player id</label>
          <div className="row">
            <input type="number" required value={id} onChange={(e) => setId(e.target.value)} />
            <button className="btn btn-ghost" type="button" disabled={loadingPreview} onClick={() => load(id)}>
              {loadingPreview ? 'Loading…' : 'Preview'}
            </button>
          </div>
          {preview && <p className="hint">About to delete {preview.playerName} ({preview.playerRole}).</p>}
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
