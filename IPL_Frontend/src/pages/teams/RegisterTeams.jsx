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
  const [loading, setLoading] = useState(false)

  function update(i, field, value) {
    setRows((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  function removeRow(i) {
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, idx) => idx !== i)))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const saved = await teamApi.registerAll(rows)
      setSuccess(`${saved.length} teams registered`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
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
            <div key={i}>
              <div className="row-head">
                <span className="row-num">Row {i + 1}</span>
                {rows.length > 1 && (
                  <button className="btn btn-ghost btn-sm" type="button" onClick={() => removeRow(i)}>
                    Remove
                  </button>
                )}
              </div>
              <div className="grid-3">
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
            </div>
          ))}
          <div className="form-actions">
            <button className="btn btn-ghost" type="button" disabled={loading} onClick={() => setRows((prev) => [...prev, row()])}>Add row</button>
            <button className="btn btn-red" type="submit" disabled={loading}>
              {loading ? 'Saving…' : 'Save all'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
