import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import PublicLayout from './components/PublicLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
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

function Guard({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
      <Route element={<Guard><Layout /></Guard>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/players/register" element={<RegisterPlayer />} />
        <Route path="/players/register-all" element={<RegisterPlayers />} />
        <Route path="/players/find" element={<FindPlayer />} />
        <Route path="/players" element={<AllPlayers />} />
        <Route path="/players/update" element={<UpdatePlayer />} />
        <Route path="/players/delete" element={<DeletePlayer />} />
        <Route path="/players/delete-all" element={<DeleteAllPlayers />} />
        <Route path="/teams/register" element={<RegisterTeam />} />
        <Route path="/teams/register-all" element={<RegisterTeams />} />
        <Route path="/teams/find" element={<FindTeam />} />
        <Route path="/teams" element={<AllTeams />} />
        <Route path="/teams/update" element={<UpdateTeam />} />
        <Route path="/teams/delete" element={<DeleteTeam />} />
        <Route path="/teams/delete-all" element={<DeleteAllTeams />} />
      </Route>
    </Routes>
  )
}
