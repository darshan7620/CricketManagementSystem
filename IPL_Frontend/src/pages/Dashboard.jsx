import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { playerApi, teamApi } from '../api.js'
import { useAuth } from '../auth/AuthContext.jsx'
import Message from '../components/Message.jsx'

export default function Dashboard() {
  const { player } = useAuth()
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([playerApi.findAll(), teamApi.findAll()])
      .then(([plist, tlist]) => {
        setPlayers(Array.isArray(plist) ? plist : [])
        setTeams(Array.isArray(tlist) ? tlist : [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const unassigned = useMemo(
    () => players.filter((p) => !p.team?.teamId).length,
    [players],
  )

  const byTeam = useMemo(() => {
    const map = new Map()
    teams.forEach((t) => map.set(t.teamId, { ...t, squad: [] }))
    players.forEach((p) => {
      const id = p.team?.teamId
      if (id && map.has(id)) map.get(id).squad.push(p)
    })
    return [...map.values()]
  }, [players, teams])

  return (
    <>
      <h1 className="page-title">Welcome, {player?.playerName}</h1>
      <p className="page-sub">
        Player id {player?.playerId} · {player?.email} · {player?.playerRole}
        {player?.team?.teamName ? ` · ${player.team.teamName}` : ''}
      </p>
      <Message error={error} />

      <div className="stat-row">
        <div className="stat-card">
          <span>Squad size</span>
          <strong>{loading ? '—' : players.length}</strong>
        </div>
        <div className="stat-card">
          <span>Franchises</span>
          <strong>{loading ? '—' : teams.length}</strong>
        </div>
        <div className="stat-card">
          <span>Unassigned</span>
          <strong>{loading ? '—' : unassigned}</strong>
        </div>
      </div>

      <div className="ops">
        <Link to="/profile"><strong>My profile</strong><span>Update your PLAYER record</span></Link>
        <Link to="/players/register"><strong>Register player</strong><span>Add a squad member</span></Link>
        <Link to="/players"><strong>Squad list</strong><span>Everyone in the database</span></Link>
        <Link to="/teams/register"><strong>Register team</strong><span>Add a franchise</span></Link>
        <Link to="/teams"><strong>Team list</strong><span>All franchises</span></Link>
        <Link to="/players/find"><strong>Find player</strong><span>Lookup by id</span></Link>
      </div>

      <h2 className="section-title">Franchises</h2>
      {loading && <p className="page-sub">Loading league snapshot…</p>}
      {!loading && teams.length === 0 && (
        <p className="empty">No franchises yet. Register a team to start building squads.</p>
      )}
      <div className="franchise-grid">
        {byTeam.map((t) => (
          <article key={t.teamId} className="franchise-card">
            <h3>{t.teamName}</h3>
            <p>Owner {t.teamOwner} · Captain {t.teamCaptain}</p>
            <p className="squad-count">{t.squad.length} player{t.squad.length === 1 ? '' : 's'}</p>
            <ul>
              {t.squad.slice(0, 6).map((p) => (
                <li key={p.playerId}>{p.playerName} · {p.playerRole}</li>
              ))}
            </ul>
            <Link to={`/teams/find?id=${t.teamId}`}>Open team</Link>
          </article>
        ))}
      </div>
    </>
  )
}
