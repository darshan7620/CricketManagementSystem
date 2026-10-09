import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { playerApi, teamApi } from '../api.js'
import { useAuth } from '../auth/AuthContext.jsx'
import Message from '../components/Message.jsx'

const adminOps = [
  ['/players/register', 'Register player', 'Add a squad member'],
  ['/players/register-all', 'Register many', 'Bulk-insert players'],
  ['/players/update', 'Update player', 'Edit an existing row'],
  ['/players/delete', 'Delete player', 'Remove one player'],
  ['/players/delete-all', 'Delete all players', 'Clear the PLAYER table'],
  ['/teams/register', 'Register team', 'Add a franchise'],
  ['/teams/register-all', 'Register many teams', 'Bulk-insert franchises'],
  ['/teams/update', 'Update team', 'Edit a franchise'],
  ['/teams/delete', 'Delete team', 'Remove one franchise'],
  ['/teams/delete-all', 'Delete all teams', 'Clear the TEAM table'],
]

export default function AdminDashboard() {
  const { admin } = useAuth()
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

  return (
    <>
      <h1 className="page-title">Admin console</h1>
      <p className="page-sub">
        Signed in as {admin?.name || 'Administrator'} · {admin?.email} · ADMIN
      </p>
      <Message error={error} />

      <div className="stat-row">
        <div className="stat-card">
          <span>Players</span>
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

      <h2 className="section-title">Operations</h2>
      <div className="ops">
        {adminOps.map(([to, title, sub]) => (
          <Link key={to} to={to}>
            <strong>{title}</strong>
            <span>{sub}</span>
          </Link>
        ))}
      </div>

      <h2 className="section-title">Read-only views</h2>
      <div className="ops">
        <Link to="/players"><strong>All players</strong><span>Search the squad</span></Link>
        <Link to="/teams"><strong>All teams</strong><span>Every franchise</span></Link>
        <Link to="/players/find"><strong>Find player</strong><span>Lookup by id</span></Link>
        <Link to="/teams/find"><strong>Find team</strong><span>Lookup by id</span></Link>
      </div>
    </>
  )
}
