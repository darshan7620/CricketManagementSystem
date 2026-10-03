import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function Home() {
  const { player } = useAuth()

  return (
    <section className="landing">
      <div className="landing-media" aria-hidden="true">
        <img className="ken-burns" src="/images/hero-stadium.jpg" alt="" />
        <div className="landing-shade" />
        <div className="landing-scan" />
        <span className="float-orb orb-a" />
        <span className="float-orb orb-b" />
        <span className="cricket-ball" />
      </div>

      <div className="landing-copy">
        <p className="eyebrow fade-up">Season operations</p>
        <h2 className="fade-up delay-1">
          Command the league
          <span>in sharp crimson.</span>
        </h2>
        <p className="fade-up delay-2">
          Register as a player, lock in your franchise, and run squads from a dark IPL console.
          Accounts are stored in the PLAYER table through the API gateway.
        </p>
        <div className="landing-actions fade-up delay-3">
          {player ? (
            <Link className="btn btn-red btn-lg" to="/dashboard">Enter dashboard</Link>
          ) : (
            <>
              <Link className="btn btn-red btn-lg" to="/login">Log in</Link>
              <Link className="btn btn-ghost btn-lg" to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
