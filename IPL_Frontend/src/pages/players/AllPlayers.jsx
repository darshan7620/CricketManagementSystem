import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { playerApi } from '../../api.js'
import Message from '../../components/Message.jsx'

export default function AllPlayers() {
  const [players, setPlayers] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    playerApi.findAll()
      .then((data) => setPlayers(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return players
    return players.filter((p) =>
      [p.playerName, p.email, p.playerRole, p.team?.teamName, String(p.playerId)]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [players, query])

  return (
    <>
      <h1 className="page-title">All players</h1>
      <p className="page-sub">Full PLAYER table. Search by name, email, role, or franchise.</p>
      <div className="card">
        <Message error={error} />
        <div className="filter-bar">
          <label>Filter</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search squad" />
        </div>
        {loading && <p className="page-sub">Loading players…</p>}
        {!loading && filtered.length === 0 && <p className="empty">No players match this view.</p>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Id</th><th>Name</th><th>Email</th><th>Role</th><th>Jersey</th><th>Age</th><th>Team</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.playerId}>
                  <td>{p.playerId}</td>
                  <td>{p.playerName}</td>
                  <td>{p.email || '—'}</td>
                  <td>{p.playerRole}</td>
                  <td>{p.jerseyNo}</td>
                  <td>{p.age}</td>
                  <td>{p.team?.teamName || 'Unassigned'}</td>
                  <td className="table-actions">
                    <Link to={`/players/find?id=${p.playerId}`}>View</Link>
                    <Link to={`/players/update?id=${p.playerId}`}>Edit</Link>
                    <Link to={`/players/delete?id=${p.playerId}`}>Delete</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
