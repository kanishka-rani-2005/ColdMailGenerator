import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../services/api'

const starterMessages = [
  {
    sender: 'bot',
    text: 'Hi! Tell me the role, company, and candidate background, and I will generate a cold email, LinkedIn DM, and follow-up.',
  },
]

function HomePage({ user, onLogout }) {
  const [historyItems, setHistoryItems] = useState([])
  const [messages, setMessages] = useState(starterMessages)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)

  const startNewChat = () => {
    setMessages([
      {
        sender: 'bot',
        text: 'Hi! Tell me the role, company, and candidate background, and I will generate a cold email, LinkedIn DM, and follow-up.',
      },
    ])
    setDraft('')
    setLoading(false)
  }

  const handleLogoutClick = async () => {
    if (onLogout) {
      await onLogout()
    }
  }

  const displayName = useMemo(() => {
    if (user?.name) return user.name
    if (user?.email) return user.email.split('@')[0]
    return 'Agent'
  }, [user])

  const formatHistoryDate = (value) => {
    if (!value) return 'Recently'

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'Recently'

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  const fetchHistory = async () => {
    try {
      const response = await api.get('/ai/history')
      const items = Array.isArray(response.data) ? response.data : []

      const mapped = items.map((item) => ({
        id: item._id,
        title: item.subject || item.prompt || 'Generated Email',
        tone: item.prompt ? item.prompt.slice(0, 30) : 'Cold email',
        time: formatHistoryDate(item.createdAt),
        prompt: item.prompt,
        subject: item.subject,
        emailBody: item.emailBody,
        linkedInDM: item.linkedInDM,
        followUpEmail: item.followUpEmail,
      }))

      setHistoryItems(mapped)
    } catch (error) {
      if (error.response?.status === 401) {
        if (onLogout) await onLogout()
        return
      }

      console.error('History fetch error:', error)
    }
  }

  const loadHistoryItem = async (itemId) => {
    if (!itemId) return

    try {
      const response = await api.get(`/ai/history/${itemId}`)
      const history = response.data?.history || response.data

      const result = {
        subject: history.subject || 'Generated Outreach',
        emailBody: history.emailBody || '',
        linkedInDM: history.linkedInDM || '',
        followUpEmail: history.followUpEmail || '',
      }

      setMessages([
        {
          sender: 'bot',
          type: 'result',
          result,
        },
      ])
      setDraft('')
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to load saved history item.'
      toast.error(message)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleSend = async () => {
    const trimmed = draft.trim()
    if (!trimmed) return

    const nextUserMessage = { sender: 'user', text: trimmed }
    setMessages((current) => [...current, nextUserMessage])
    setDraft('')
    setLoading(true)

    try {
      const response = await api.post('/ai/generate-email', { prompt: trimmed })
      const result = response.data

      const generatedResult = {
        subject: result.subject || 'Generated Outreach',
        emailBody: result.emailBody || '',
        linkedInDM: result.linkedInDM || '',
        followUpEmail: result.followUpEmail || '',
      }

      const updatedHistory = [
        {
          id: result._id,
          title: result.subject || 'Generated Email',
          tone: trimmed.slice(0, 30),
          time: 'Just now',
          prompt: trimmed,
          subject: result.subject,
          emailBody: result.emailBody,
          linkedInDM: result.linkedInDM,
          followUpEmail: result.followUpEmail,
        },
        ...historyItems,
      ]

      setHistoryItems(updatedHistory)
      setMessages((current) => [
        ...current,
        {
          sender: 'bot',
          type: 'result',
          result: generatedResult,
        },
      ])
      toast.success('Email generated successfully.')
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to generate email right now.'
      setMessages((current) => [
        ...current,
        {
          sender: 'bot',
          text: `I could not generate the email. ${message}`,
        },
      ])
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="home-shell">
      <aside className="history-sidebar">
        <div className="sidebar-header">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>Cold Mailer</h2>
          </div>
          <button type="button" className="new-button" onClick={startNewChat}>+ New</button>
        </div>

        <div className="history-list">
          {historyItems.length === 0 ? (
            <div className="empty-history">No generated campaigns yet.</div>
          ) : (
            historyItems.map((item) => (
              <button type="button" key={item.id} className="history-item" onClick={() => loadHistoryItem(item.id)}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.tone}</span>
                </div>
                <small>{item.time}</small>
              </button>
            ))
          )}
        </div>
      </aside>

      <main className="chat-panel">
        <header className="chat-header">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h3>{displayName}</h3>
          </div>

          <div className="header-actions">
            <button type="button" className="logout-action" onClick={handleLogoutClick}>Logout</button>
          </div>
        </header>

        <section className="message-list">
          {messages.map((message, index) => (
            <div key={`${message.sender}-${index}`} className={`message-row ${message.sender === 'user' ? 'user' : 'bot'}`}>
              <div className="avatar">{message.sender === 'user' ? 'A' : 'AI'}</div>
              {message.type === 'result' ? (
                <div className="result-bubble">
                  <div className="result-block">
                    <span className="result-label">Subject</span>
                    <p>{message.result?.subject}</p>
                  </div>

                  <div className="result-block">
                    <span className="result-label">Email</span>
                    <p>{message.result?.emailBody}</p>
                  </div>

                  <div className="result-block">
                    <span className="result-label">LinkedIn DM</span>
                    <p>{message.result?.linkedInDM}</p>
                  </div>

                  <div className="result-block">
                    <span className="result-label">Follow Up Email</span>
                    <p>{message.result?.followUpEmail}</p>
                  </div>
                </div>
              ) : (
                <div className="bubble">
                  {message.text}
                </div>
              )}
            </div>
          ))}
        </section>

        <div className="composer">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write your campaign idea or ask for a new cold email..."
            rows={3}
          />
          <div className="composer-actions">
            <button type="button" className="send-btn" onClick={handleSend} disabled={loading}>
              {loading ? 'Generating...' : 'Send'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
