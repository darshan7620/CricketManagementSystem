import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { teamApi } from '../../api.js'
import Message from '../../components/Message.jsx'

export default function AllTeams() {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    teamApi.findAll()
      .then((data) => setTeams(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <h1 className="page-title">All teams</h1>
      <p className="page-sub">Every franchise in the TEAM table.</p>
      <div className="card">
        <Message error={error} />
        {loading && <p className="page-sub">Loading franchises…</p>}
        {!loading && teams.length === 0 && <p className="empty">No teams registered yet.</p>}
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Id</th><th>Name</th><th>Owner</th><th>Captain</th><th></th></tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t.teamId}>
                  <td>{t.teamId}</td>
                  <td>{t.teamName}</td>
                  <td>{t.teamOwner}</td>
                  <td>{t.teamCaptain}</td>
                  <td className="table-actions">
                    <Link to={`/teams/find?id=${t.teamId}`}>View</Link>
                    <Link to={`/teams/update?id=${t.teamId}`}>Edit</Link>
                    <Link to={`/teams/delete?id=${t.teamId}`}>Delete</Link>
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
