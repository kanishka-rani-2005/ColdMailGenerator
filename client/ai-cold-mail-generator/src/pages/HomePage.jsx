import { useMemo, useState } from 'react'

const historyItems = [
]

const starterMessages = [
]

function HomePage({ user, onLogout }) {
  const [messages, setMessages] = useState(starterMessages)
  const [draft, setDraft] = useState('')

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

  const handleSend = () => {
    if (!draft.trim()) return

    const nextUserMessage = { sender: 'user', text: draft.trim() }
    const nextBotMessage = {
      sender: 'bot',
      text: 'Here is a polished version: Hi [Name], I came across your product and thought it could help with [problem]. I would love to show you a quick demo and share a few ideas that might improve your outreach process. If it is useful, I can set up a short call next week.',
    }

    setMessages((current) => [...current, nextUserMessage, nextBotMessage])
    setDraft('')
  }

  return (
    <div className="home-shell">
      <aside className="history-sidebar">
        <div className="sidebar-header">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>Cold Mailer</h2>
          </div>
          <button type="button" className="new-button">+ New</button>
        </div>

        <div className="history-list">
          {historyItems.map((item) => (
            <button type="button" key={item.id} className="history-item">
              <div>
                <strong>{item.title}</strong>
                <span>{item.tone}</span>
              </div>
              <small>{item.time}</small>
            </button>
          ))}
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
              <div className="bubble">
                {message.text}
              </div>
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
            <button type="button" className="send-btn" onClick={handleSend}>Send</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
