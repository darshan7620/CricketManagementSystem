import { useEffect, useState } from 'react'
import { teamApi } from '../api.js'

export default function TeamSelect({ value, onChange, optional = true }) {
  const [teams, setTeams] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    teamApi.findAll()
      .then((data) => setTeams(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message))
  }, [])

  return (
    <>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        {optional && <option value="">Unassigned</option>}
        {teams.map((t) => (
          <option key={t.teamId} value={t.teamId}>
            {t.teamName} · #{t.teamId}
          </option>
        ))}
      </select>
      {error && <p className="hint">Could not load franchises: {error}</p>}
    </>
  )
}
