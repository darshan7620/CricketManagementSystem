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

  async function load(playerId) {
    setError('')
    setPreview(null)
    try {
      setPreview(await playerApi.find(playerId))
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
    const label = preview?.playerName || `player ${id}`
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return
    try {
      setSuccess(await playerApi.remove(id))
      setPreview(null)
    } catch (err) {
      setError(err.message)
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
            <button className="btn btn-ghost" type="button" onClick={() => load(id)}>Preview</button>
          </div>
          {preview && <p className="hint">About to delete {preview.playerName} ({preview.playerRole}).</p>}
          <button className="btn btn-danger" type="submit">Delete</button>
        </form>
      </div>
    </>
  )
}
