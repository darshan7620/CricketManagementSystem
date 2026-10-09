import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { playerApi } from '../../api.js'
import { useAuth } from '../../auth/AuthContext.jsx'
import Message from '../../components/Message.jsx'

export default function FindPlayer() {
  const { isAdmin } = useAuth()
  const [params] = useSearchParams()
  const [id, setId] = useState(params.get('id') || '')
  const [player, setPlayer] = useState(null)
  const [error, setError] = useState('')

  async function search(playerId) {
    setError('')
    setPlayer(null)
    try {
      setPlayer(await playerApi.find(playerId))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (params.get('id')) search(params.get('id'))
  }, [params])

  return (
    <>
      <h1 className="page-title">Find player</h1>
      <p className="page-sub">Look up a PLAYER record by id.</p>
      <div className="card">
        <Message error={error} />
        <form onSubmit={(e) => { e.preventDefault(); search(id) }}>
          <label>Player id</label>
          <input type="number" required value={id} onChange={(e) => setId(e.target.value)} />
          <button className="btn btn-red" type="submit">Search</button>
        </form>
        {player && (
          <div className="detail-card">
            <table>
              <tbody>
                <tr><th>Id</th><td>{player.playerId}</td></tr>
                <tr><th>Name</th><td>{player.playerName}</td></tr>
                <tr><th>Email</th><td>{player.email || '—'}</td></tr>
                <tr><th>Role</th><td>{player.playerRole}</td></tr>
                <tr><th>Jersey</th><td>{player.jerseyNo}</td></tr>
                <tr><th>Age</th><td>{player.age}</td></tr>
                <tr><th>Team</th><td>{player.team?.teamName || 'Unassigned'}</td></tr>
              </tbody>
            </table>
            {isAdmin && (
              <div className="table-actions" style={{ marginTop: 12 }}>
                <Link to={`/players/update?id=${player.playerId}`}>Edit</Link>
                <Link to={`/players/delete?id=${player.playerId}`}>Delete</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
