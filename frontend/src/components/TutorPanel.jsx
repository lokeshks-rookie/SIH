import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'

export default function TutorPanel({ onClose }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hi! I am your quantum tutor. Ask me about a concept, circuit, or algorithm.' }])
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendQuestion(event) {
    event.preventDefault()
    const text = question.trim()
    if (!text || loading) return
    setQuestion('')
    setMessages((current) => [...current, { role: 'user', content: text }])
    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/tutor`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages, user: user?.displayName || 'student' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setMessages((current) => [...current, { role: 'assistant', content: data.reply }])
    } catch (error) {
      setMessages((current) => [...current, { role: 'assistant', content: error.message || 'Tutor is unavailable right now.' }])
    } finally { setLoading(false) }
  }

  return <aside className="fixed right-4 bottom-4 z-50 w-[min(380px,calc(100vw-2rem))] h-[min(620px,calc(100vh-6rem))] bg-[var(--color-base)] border border-[var(--color-border)] rounded-[16px] flex flex-col overflow-hidden">
    <header className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
      <div><p className="font-display text-[18px] font-semibold m-0">AI Tutor</p><p className="text-[12px] text-[var(--color-text)]/60 m-0">Grounded in quantum computing</p></div>
      <button onClick={onClose} aria-label="Close AI tutor" className="text-[20px] bg-transparent border-none cursor-pointer">x</button>
    </header>
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message, index) => <div key={index} className={`max-w-[88%] p-3 rounded-[12px] text-[13px] leading-relaxed ${message.role === 'user' ? 'ml-auto bg-[var(--color-accent-deep)] text-white' : 'bg-[var(--color-card)]'}`}>{message.content}</div>)}
      {loading && <div className="text-[13px] text-[var(--color-text)]/60">Thinking...</div>}
    </div>
    <form onSubmit={sendQuestion} className="p-3 border-t border-[var(--color-border)] flex gap-2">
      <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask your tutor..." className="min-w-0 flex-1 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-[13px] outline-none" />
      <button disabled={loading} className="rounded-full border-none bg-[var(--color-action)] text-white px-4 text-[13px] cursor-pointer disabled:opacity-50">Send</button>
    </form>
  </aside>
}
