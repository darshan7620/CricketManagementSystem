import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { playerApi, teamApi } from '../../api.js'
import Message from '../../components/Message.jsx'

export default function FindTeam() {
  const [params] = useSearchParams()
  const [id, setId] = useState(params.get('id') || '')
  const [team, setTeam] = useState(null)
  const [squad, setSquad] = useState([])
  const [error, setError] = useState('')

  async function search(teamId) {
    setError('')
    setTeam(null)
    setSquad([])
    try {
      const t = await teamApi.find(teamId)
      setTeam(t)
      const players = await playerApi.findAll().catch(() => [])
      setSquad((Array.isArray(players) ? players : []).filter((p) => p.team?.teamId === t.teamId))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (params.get('id')) search(params.get('id'))
  }, [params])

  return (
    <>
      <h1 className="page-title">Find team</h1>
      <p className="page-sub">Look up a franchise and its current squad.</p>
      <div className="card">
        <Message error={error} />
        <form onSubmit={(e) => { e.preventDefault(); search(id) }}>
          <label>Team id</label>
          <input type="number" required value={id} onChange={(e) => setId(e.target.value)} />
          <button className="btn btn-red" type="submit">Search</button>
        </form>
        {team && (
          <div className="detail-card">
            <table>
              <tbody>
                <tr><th>Id</th><td>{team.teamId}</td></tr>
                <tr><th>Name</th><td>{team.teamName}</td></tr>
                <tr><th>Owner</th><td>{team.teamOwner}</td></tr>
                <tr><th>Captain</th><td>{team.teamCaptain}</td></tr>
              </tbody>
            </table>
            <div className="table-actions" style={{ marginTop: 12 }}>
              <Link to={`/teams/update?id=${team.teamId}`}>Edit</Link>
              <Link to={`/teams/delete?id=${team.teamId}`}>Delete</Link>
            </div>
            <h2 className="section-title">Squad ({squad.length})</h2>
            {squad.length === 0 && <p className="empty">No players assigned to this franchise yet.</p>}
            <ul>
              {squad.map((p) => (
                <li key={p.playerId}>
                  <Link to={`/players/find?id=${p.playerId}`}>{p.playerName}</Link> · {p.playerRole} · #{p.jerseyNo}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
