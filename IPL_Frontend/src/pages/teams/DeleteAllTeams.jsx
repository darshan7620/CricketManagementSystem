import { useState } from 'react'
import { teamApi } from '../../api.js'
import Message from '../../components/Message.jsx'

export default function DeleteAllTeams() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!window.confirm('Delete every franchise? Players will keep their records but lose the team link. This cannot be undone.')) return
    setLoading(true)
    try {
      setSuccess(await teamApi.removeAll())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="page-title">Delete all teams</h1>
      <p className="page-sub">Clears the TEAM table. This cannot be undone.</p>
      <div className="card">
        <Message error={error} success={success} />
        <form onSubmit={onSubmit}>
          <button className="btn btn-danger" type="submit" disabled={loading}>
            {loading ? 'Deleting…' : 'Delete every team'}
          </button>
        </form>
      </div>
    </>
  )
}
