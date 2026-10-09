import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import PublicLayout from './components/PublicLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Profile from './pages/Profile.jsx'
import RegisterPlayer from './pages/players/RegisterPlayer.jsx'
import RegisterPlayers from './pages/players/RegisterPlayers.jsx'
import FindPlayer from './pages/players/FindPlayer.jsx'
import AllPlayers from './pages/players/AllPlayers.jsx'
import UpdatePlayer from './pages/players/UpdatePlayer.jsx'
import DeletePlayer from './pages/players/DeletePlayer.jsx'
import DeleteAllPlayers from './pages/players/DeleteAllPlayers.jsx'
import RegisterTeam from './pages/teams/RegisterTeam.jsx'
import RegisterTeams from './pages/teams/RegisterTeams.jsx'
import FindTeam from './pages/teams/FindTeam.jsx'
import AllTeams from './pages/teams/AllTeams.jsx'
import UpdateTeam from './pages/teams/UpdateTeam.jsx'
import DeleteTeam from './pages/teams/DeleteTeam.jsx'
import DeleteAllTeams from './pages/teams/DeleteAllTeams.jsx'

function Guard({ roles, children }) {
  return <ProtectedRoute roles={roles}>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        {/* Player area */}
        <Route path="/dashboard" element={<Guard roles={['PLAYER']}><Dashboard /></Guard>} />
        <Route path="/profile" element={<Guard roles={['PLAYER']}><Profile /></Guard>} />

        {/* Admin area */}
        <Route path="/admin" element={<Guard roles={['ADMIN']}><AdminDashboard /></Guard>} />

        {/* Shared read-only views */}
        <Route path="/players" element={<Guard roles={['PLAYER', 'ADMIN']}><AllPlayers /></Guard>} />
        <Route path="/players/find" element={<Guard roles={['PLAYER', 'ADMIN']}><FindPlayer /></Guard>} />
        <Route path="/teams" element={<Guard roles={['PLAYER', 'ADMIN']}><AllTeams /></Guard>} />
        <Route path="/teams/find" element={<Guard roles={['PLAYER', 'ADMIN']}><FindTeam /></Guard>} />

        {/* Admin-only writes */}
        <Route path="/players/register" element={<Guard roles={['ADMIN']}><RegisterPlayer /></Guard>} />
        <Route path="/players/register-all" element={<Guard roles={['ADMIN']}><RegisterPlayers /></Guard>} />
        <Route path="/players/update" element={<Guard roles={['ADMIN']}><UpdatePlayer /></Guard>} />
        <Route path="/players/delete" element={<Guard roles={['ADMIN']}><DeletePlayer /></Guard>} />
        <Route path="/players/delete-all" element={<Guard roles={['ADMIN']}><DeleteAllPlayers /></Guard>} />
        <Route path="/teams/register" element={<Guard roles={['ADMIN']}><RegisterTeam /></Guard>} />
        <Route path="/teams/register-all" element={<Guard roles={['ADMIN']}><RegisterTeams /></Guard>} />
        <Route path="/teams/update" element={<Guard roles={['ADMIN']}><UpdateTeam /></Guard>} />
        <Route path="/teams/delete" element={<Guard roles={['ADMIN']}><DeleteTeam /></Guard>} />
        <Route path="/teams/delete-all" element={<Guard roles={['ADMIN']}><DeleteAllTeams /></Guard>} />
      </Route>
    </Routes>
  )
}
