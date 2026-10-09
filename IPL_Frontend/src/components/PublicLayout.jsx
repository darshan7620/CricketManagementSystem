import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function PublicLayout() {
  const { user, isAdmin, logout } = useAuth()
  const displayName = user?.playerName || user?.name || ''

  return (
    <div className="public-shell">
      <header className="public-nav">
        <Link className="brand brand-public" to="/">
          <div className="brand-mark">IPL</div>
          <div>
            <h1>CRICKET MS</h1>
            <p>Franchise control room</p>
          </div>
        </Link>
        <nav className="public-nav-links">
          {user ? (
            <>
              <span className="nav-user">{displayName}</span>
              {isAdmin ? (
                <NavLink className="btn btn-red" to="/admin">Admin console</NavLink>
              ) : (
                <NavLink className="btn btn-red" to="/dashboard">Dashboard</NavLink>
              )}
              <button className="btn btn-ghost" type="button" onClick={logout}>Log out</button>
            </>
          ) : (
            <>
              <NavLink className="btn btn-ghost" to="/login">Log in</NavLink>
              <NavLink className="btn btn-red" to="/signup">Sign up</NavLink>
            </>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
