import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const playerLinks = [
  ['/players/register', 'Register player'],
  ['/players/register-all', 'Register many'],
  ['/players/find', 'Find player'],
  ['/players', 'All players'],
  ['/players/update', 'Update player'],
  ['/players/delete', 'Delete player'],
  ['/players/delete-all', 'Delete all'],
]

const teamLinks = [
  ['/teams/register', 'Register team'],
  ['/teams/register-all', 'Register many'],
  ['/teams/find', 'Find team'],
  ['/teams', 'All teams'],
  ['/teams/update', 'Update team'],
  ['/teams/delete', 'Delete team'],
  ['/teams/delete-all', 'Delete all'],
]

function bannerFor(path) {
  if (path.startsWith('/teams')) return '/images/teams-banner.jpg'
  if (path.startsWith('/players')) return '/images/players-action.jpg'
  return '/images/dashboard-night.jpg'
}

export default function Layout() {
  const { player, logout } = useAuth()
  const { pathname } = useLocation()
  const photo = bannerFor(pathname)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/">
          <div className="brand-mark">IPL</div>
          <div>
            <h1>CRICKET MS</h1>
            <p>Ops console</p>
          </div>
        </NavLink>

        <nav className="nav-group">
          <h2>Account</h2>
          <NavLink to="/">Landing</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/profile">My profile</NavLink>
        </nav>

        <nav className="nav-group">
          <h2>Players</h2>
          {playerLinks.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/players'}>{label}</NavLink>
          ))}
        </nav>

        <nav className="nav-group">
          <h2>Teams</h2>
          {teamLinks.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/teams'}>{label}</NavLink>
          ))}
        </nav>

        {player && (
          <div className="user-chip">
            Signed in as <strong>{player.playerName}</strong>
            <div>{player.email}</div>
            <button className="linkish" type="button" onClick={logout}>Log out</button>
          </div>
        )}
      </aside>
      <div className="workspace">
        <div className="page-banner">
          <img src={photo} alt="" />
          <div className="page-banner-shade" />
        </div>
        <main className="content fade-up">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
