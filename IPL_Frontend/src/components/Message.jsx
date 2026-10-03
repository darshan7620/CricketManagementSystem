export default function Message({ error, success }) {
  if (error) return <p className="msg err">{error}</p>
  if (success) return <p className="msg ok">{success}</p>
  return null
}
