import { useState } from 'react'
import { teamApi } from '../../api.js'
import Message from '../../components/Message.jsx'

function row() {
  return { teamName: '', teamOwner: '', teamCaptain: '' }
}

export default function RegisterTeams() {
  const [rows, setRows] = useState([row(), row()])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function update(i, field, value) {
    setRows((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      const saved = await teamApi.registerAll(rows)
      setSuccess(`${saved.length} teams registered`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <h1 className="page-title">Register many teams</h1>
      <p className="page-sub">POST /team-api/registerAll</p>
      <div className="card">
        <Message error={error} success={success} />
        <form onSubmit={onSubmit}>
          {rows.map((r, i) => (
            <div key={i} className="grid-3">
              <div>
                <label>Name</label>
                <input required value={r.teamName} onChange={(e) => update(i, 'teamName', e.target.value)} />
              </div>
              <div>
                <label>Owner</label>
                <input required value={r.teamOwner} onChange={(e) => update(i, 'teamOwner', e.target.value)} />
              </div>
              <div>
                <label>Captain</label>
                <input required value={r.teamCaptain} onChange={(e) => update(i, 'teamCaptain', e.target.value)} />
              </div>
            </div>
          ))}
          <div className="row">
            <button className="btn btn-ghost" type="button" onClick={() => setRows((prev) => [...prev, row()])}>Add row</button>
            <button className="btn btn-red" type="submit">Save all</button>
          </div>
        </form>
      </div>
    </>
  )
}
