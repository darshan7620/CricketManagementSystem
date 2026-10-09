import { useState } from 'react'
import { playerApi } from '../../api.js'
import Message from '../../components/Message.jsx'
import TeamSelect from '../../components/TeamSelect.jsx'

function row() {
  return { playerName: '', playerRole: 'Batsman', jerseyNo: '', age: '', teamId: '' }
}

export default function RegisterPlayers() {
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
      const body = rows.map((r) => {
        const item = {
          playerName: r.playerName,
          playerRole: r.playerRole,
          jerseyNo: Number(r.jerseyNo),
          age: Number(r.age),
        }
        if (r.teamId) item.team = { teamId: Number(r.teamId) }
        return item
      })
      const saved = await playerApi.registerAll(body)
      setSuccess(`${saved.length} players registered`)
      setRows([row(), row()])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="page-title">Register many players</h1>
      <p className="page-sub">Bulk-insert PLAYER rows in one request.</p>
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
                <input required value={r.playerName} onChange={(e) => update(i, 'playerName', e.target.value)} />
              </div>
              <div>
                <label>Role</label>
                <select value={r.playerRole} onChange={(e) => update(i, 'playerRole', e.target.value)}>
                  <option>Batsman</option>
                  <option>Bowler</option>
                  <option>All-rounder</option>
                  <option>Wicket-keeper</option>
                </select>
              </div>
              <div>
                <label>Jersey / Age / Team</label>
                <div className="row">
                  <input type="number" required placeholder="Jersey" value={r.jerseyNo} onChange={(e) => update(i, 'jerseyNo', e.target.value)} />
                  <input type="number" required placeholder="Age" value={r.age} onChange={(e) => update(i, 'age', e.target.value)} />
                  <TeamSelect value={r.teamId} onChange={(v) => update(i, 'teamId', v)} />
                </div>
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
