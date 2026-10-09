import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

const playerWriteLinks = [
  ['/players/register', 'Register player'],
  ['/players/register-all', 'Register many'],
  ['/players/update', 'Update player'],
  ['/players/delete', 'Delete player'],
  ['/players/delete-all', 'Delete all'],
]

const teamWriteLinks = [
  ['/teams/register', 'Register team'],
  ['/teams/register-all', 'Register many'],
  ['/teams/update', 'Update team'],
  ['/teams/delete', 'Delete team'],
  ['/teams/delete-all', 'Delete all'],
]

const readLinks = [
  ['/players', 'All players'],
  ['/players/find', 'Find player'],
  ['/teams', 'All teams'],
  ['/teams/find', 'Find team'],
]

function bannerFor(path) {
  if (path.startsWith('/teams')) return '/images/teams-banner.jpg'
  if (path.startsWith('/players')) return '/images/players-action.jpg'
  return '/images/dashboard-night.jpg'
}

export default function Layout() {
  const { user, isAdmin, isPlayer, logout } = useAuth()
  const { pathname } = useLocation()
  const photo = bannerFor(pathname)
  const displayName = user?.playerName || user?.name || 'Signed in'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink className="brand" to="/">
          <div className="brand-mark">IPL</div>
          <div>
            <h1>CRICKET MS</h1>
            <p>{isAdmin ? 'Admin console' : 'Player console'}</p>
          </div>
        </NavLink>

        <nav className="nav-group">
          <h2>Account</h2>
          <NavLink to="/">Landing</NavLink>
          {isAdmin && <NavLink to="/admin">Admin console</NavLink>}
          {isPlayer && <NavLink to="/dashboard">Dashboard</NavLink>}
          {isPlayer && <NavLink to="/profile">My profile</NavLink>}
        </nav>

        <nav className="nav-group">
          <h2>Directory</h2>
          {readLinks.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/players' || to === '/teams'}>{label}</NavLink>
          ))}
        </nav>

        {isAdmin && (
          <>
            <nav className="nav-group">
              <h2>Players</h2>
              {playerWriteLinks.map(([to, label]) => (
                <NavLink key={to} to={to}>{label}</NavLink>
              ))}
            </nav>

            <nav className="nav-group">
              <h2>Teams</h2>
              {teamWriteLinks.map(([to, label]) => (
                <NavLink key={to} to={to}>{label}</NavLink>
              ))}
            </nav>
          </>
        )}

        {user && (
          <div className="user-chip">
            Signed in as <strong>{displayName}</strong>
            <div>{user.email}</div>
            <div>{isAdmin ? 'ADMIN' : 'PLAYER'}</div>
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
