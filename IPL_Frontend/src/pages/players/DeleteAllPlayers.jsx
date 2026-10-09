import { useState } from 'react'
import { playerApi } from '../../api.js'
import Message from '../../components/Message.jsx'

export default function DeleteAllPlayers() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!window.confirm('Delete every player, including login accounts? This cannot be undone.')) return
    setLoading(true)
    try {
      setSuccess(await playerApi.removeAll())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="page-title">Delete all players</h1>
      <p className="page-sub">Clears the PLAYER table. This cannot be undone.</p>
      <div className="card">
        <Message error={error} success={success} />
        <form onSubmit={onSubmit}>
          <button className="btn btn-danger" type="submit" disabled={loading}>
            {loading ? 'Deleting…' : 'Delete every player'}
          </button>
        </form>
      </div>
    </>
  )
}
