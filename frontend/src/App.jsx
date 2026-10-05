import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(null)
  const [securityData, setSecurityData] = useState(null)
  const [activeView, setActiveView] = useState('assistant')

  const [analysisInput, setAnalysisInput] = useState('')
  const [analysisData, setAnalysisData] = useState(null)
  const [analysisLoading, setAnalysisLoading] = useState(false)

  const [incidentInput, setIncidentInput] = useState('')
  const [incidentData, setIncidentData] = useState(null)
  const [incidentLoading, setIncidentLoading] = useState(false)

  const [historyData, setHistoryData] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState('')

  const [knowledgeSearch, setKnowledgeSearch] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [autoAnalysis, setAutoAnalysis] = useState(true)

  const [analyticsData, setAnalyticsData] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState('')

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Welcome to CyberSage. I am your AI cybersecurity assistant. Ask me about phishing, malware, ransomware, network security, account security, or any cybersecurity concern.'
    }
  ])

  const knowledgeBase = [
    {
      title: 'Phishing',
      category: 'Threat Intelligence',
      description: 'Identify phishing attempts and suspicious messages.',
      content:
        'Phishing attacks attempt to trick users into revealing credentials, financial information, OTPs, or other sensitive information. Always verify the sender, inspect URLs, and avoid clicking suspicious links.',
      tags: ['Email Security', 'Credential Theft', 'Social Engineering'],
      icon: '◈'
    },
    {
      title: 'Ransomware',
      category: 'Malware',
      description: 'Understand ransomware attacks and defensive strategies.',
      content:
        'Ransomware encrypts files or systems and demands payment from victims. Maintain offline backups, keep systems patched, restrict privileges, and monitor unusual file activity.',
      tags: ['Encryption', 'Malware', 'Incident Response'],
      icon: '▣'
    },
    {
      title: 'Malware',
      category: 'Threat Intelligence',
      description: 'Learn about malicious software and common attack methods.',
      content:
        'Malware includes viruses, worms, trojans, spyware, and other malicious programs. Use endpoint protection, application controls, patch management, and network monitoring.',
      tags: ['Trojan', 'Virus', 'Endpoint Security'],
      icon: '◉'
    },
    {
      title: 'Account Security',
      category: 'Identity',
      description: 'Protect accounts from unauthorized access.',
      content:
        'Use strong unique passwords, enable multi-factor authentication, monitor account activity, and never share passwords or OTPs with unknown parties.',
      tags: ['MFA', 'Passwords', 'Identity'],
      icon: '◎'
    },
    {
      title: 'Network Security',
      category: 'Infrastructure',
      description: 'Secure networks against unauthorized activity.',
      content:
        'Network security includes firewalls, segmentation, intrusion detection, secure protocols, access controls, and continuous monitoring.',
      tags: ['Firewall', 'IDS', 'Segmentation'],
      icon: '⌁'
    },
    {
      title: 'Password Security',
      category: 'Identity',
      description: 'Build strong password protection practices.',
      content:
        'Use long unique passwords or passphrases and store them in a trusted password manager. Avoid password reuse across different services.',
      tags: ['Passwords', 'Authentication', 'Password Manager'],
      icon: '◆'
    },
    {
      title: 'Social Engineering',
      category: 'Human Security',
      description: 'Recognize manipulation-based cyber attacks.',
      content:
        'Social engineering uses psychological manipulation to influence users into performing unsafe actions. Verify unusual requests through trusted communication channels.',
      tags: ['Manipulation', 'Awareness', 'Phishing'],
      icon: '◇'
    },
    {
      title: 'Incident Response',
      category: 'Security Operations',
      description: 'Understand the process of responding to incidents.',
      content:
        'Incident response includes identification, containment, eradication, recovery, and post-incident analysis. Fast containment can significantly reduce impact.',
      tags: ['SOC', 'Containment', 'Recovery'],
      icon: '△'
    }
  ]

  const login = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'CyberSage@123'
        })
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      setToken(data.access_token)

      return data.access_token
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const getToken = async () => {
    if (token) {
      return token
    }

    return await login()
  }

  const sendMessage = async () => {
    if (!message.trim() || loading) {
      return
    }

    const userMessage = message.trim()

    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userMessage
      }
    ])

    setMessage('')
    setLoading(true)

    try {
      const accessToken = await getToken()

      if (!accessToken) {
        throw new Error('Authentication failed')
      }

      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: 'cybersage-web'
        })
      })

      if (!response.ok) {
        throw new Error('Chat request failed')
      }

      const data = await response.json()

      setSecurityData(data)

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response
        }
      ])
    } catch (error) {
      console.error(error)

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Unable to connect to CyberSage backend. Please make sure the FastAPI server is running.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const analyzeThreat = async () => {
    if (!analysisInput.trim() || analysisLoading) {
      return
    }

    setAnalysisLoading(true)
    setAnalysisData(null)

    try {
      const accessToken = await getToken()

      if (!accessToken) {
        throw new Error('Authentication failed')
      }

      const response = await fetch(
        'http://127.0.0.1:8000/threat-intelligence',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            message: analysisInput
          })
        }
      )

      if (!response.ok) {
        throw new Error('Threat analysis failed')
      }

      const data = await response.json()
      setAnalysisData(data)
    } catch (error) {
      console.error(error)
      setAnalysisData({
        error:
          'Unable to analyze the message. Make sure the backend is running.'
      })
    } finally {
      setAnalysisLoading(false)
    }
  }

  const runIncidentResponse = async () => {
    if (!incidentInput.trim() || incidentLoading) {
      return
    }

    setIncidentLoading(true)
    setIncidentData(null)

    try {
      const accessToken = await getToken()

      if (!accessToken) {
        throw new Error('Authentication failed')
      }

      const response = await fetch(
        'http://127.0.0.1:8000/incident-response',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            message: incidentInput
          })
        }
      )

      if (!response.ok) {
        throw new Error('Incident response failed')
      }

      const data = await response.json()
      setIncidentData(data)
    } catch (error) {
      console.error(error)
      setIncidentData({
        error:
          'Unable to generate incident response. Make sure the backend is running.'
      })
    } finally {
      setIncidentLoading(false)
    }
  }

  const loadChatHistory = async () => {
    setHistoryLoading(true)
    setHistoryError('')

    try {
      const accessToken = await getToken()

      if (!accessToken) {
        throw new Error('Authentication failed')
      }

      const response = await fetch(
        'http://127.0.0.1:8000/database-chat-history?session_id=cybersage-web',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load history')
      }

      const data = await response.json()
      setHistoryData(data.history || [])
    } catch (error) {
      console.error(error)
      setHistoryError('Unable to load chat history.')
    } finally {
      setHistoryLoading(false)
    }
  }

  const loadAnalytics = async () => {
    setAnalyticsLoading(true)
    setAnalyticsError('')

    try {
      const accessToken = await getToken()

      if (!accessToken) {
        throw new Error('Authentication failed')
      }

      const response = await fetch(
        'http://127.0.0.1:8000/analytics',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to load analytics')
      }

      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error(error)
      setAnalyticsError(
        'Unable to load dashboard analytics. Make sure the backend and MongoDB are running.'
      )
    } finally {
      setAnalyticsLoading(false)
    }
  }

  useEffect(() => {
    if (activeView !== 'dashboard') {
      return
    }

    const interval = setInterval(() => {
      loadAnalytics()
    }, 15000)

    return () => clearInterval(interval)
  }, [activeView, token])

  const openDashboard = async () => {
    setActiveView('dashboard')
    await loadAnalytics()
  }

  const openChatHistory = async () => {
    setActiveView('history')
    await loadChatHistory()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const formatTimestamp = (timestamp) => {
    if (!timestamp) {
      return ''
    }

    return new Date(timestamp).toLocaleString()
  }

  const filteredKnowledge = knowledgeBase.filter((item) => {
    const query = knowledgeSearch.toLowerCase().trim()

    if (!query) {
      return true
    }

    return (
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  })

  const phishing = securityData?.phishing_analysis
  const threat = securityData?.threat_detection

  const riskScore = phishing?.risk_score ?? 0
  const riskLevel = phishing?.risk_level ?? 'Low'
  const phishingProbability = phishing?.phishing_probability ?? 0

  const riskColor =
    riskLevel === 'High'
      ? 'high'
      : riskLevel === 'Medium'
        ? 'medium'
        : 'low'

  const renderDashboard = () => {
    if (analyticsLoading && !analyticsData) {
      return (
        <div className="feature-panel">
          <div className="feature-header">
            <div>
              <span className="feature-badge">SECURITY / DASHBOARD</span>
              <h1>Security Analytics Dashboard</h1>
              <p>Loading live CyberSage security analytics.</p>
            </div>
          </div>

          <div className="empty-result">
            Loading dashboard analytics...
          </div>
        </div>
      )
    }

    if (analyticsError) {
      return (
        <div className="feature-panel">
          <div className="feature-header">
            <div>
              <span className="feature-badge">SECURITY / DASHBOARD</span>
              <h1>Security Analytics Dashboard</h1>
              <p>Monitor CyberSage security activity and threat trends.</p>
            </div>

            <button
              className="secondary-button"
              onClick={loadAnalytics}
            >
              Refresh
            </button>
          </div>

          <div className="analysis-error">{analyticsError}</div>
        </div>
      )
    }

    const totalMessages = analyticsData?.total_messages ?? 0
    const totalConversations =
      analyticsData?.total_conversations ?? 0
    const totalThreats = analyticsData?.total_threats ?? 0
    const highRisk = analyticsData?.high_risk_incidents ?? 0
    const mediumRisk = analyticsData?.medium_risk_incidents ?? 0
    const lowRisk = analyticsData?.low_risk_incidents ?? 0
    const phishingDetections =
      analyticsData?.phishing_detections ?? 0

    const threatDistribution =
      analyticsData?.threat_distribution || []

    const recentThreats =
      analyticsData?.recent_threats || []

    const totalRisk = highRisk + mediumRisk + lowRisk

    const maxThreatCount =
      threatDistribution.length > 0
        ? Math.max(
            ...threatDistribution.map((item) => item.count)
          )
        : 1

    const getSeverityClass = (severity) => {
      if (!severity) {
        return 'low'
      }

      const value = severity.toLowerCase()

      if (value === 'high') {
        return 'high'
      }

      if (value === 'medium') {
        return 'medium'
      }

      return 'low'
    }

    return (
      <div className="feature-panel">
        <div className="feature-header">
          <div>
            <span className="feature-badge">
              SECURITY / DASHBOARD
            </span>
            <h1>Security Analytics Dashboard</h1>
            <p>
              Real-time visibility into CyberSage conversations,
              threats, risks, and security activity.
            </p>
          </div>

          <button
            className="secondary-button"
            onClick={loadAnalytics}
            disabled={analyticsLoading}
          >
            {analyticsLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        <div className="dashboard-live-status">
          <span></span>
          Live threat monitoring active
          <small>Auto-refresh: 15 seconds</small>
        </div>

        <div className="dashboard-summary">
          <div className="dashboard-stat">
            <span>TOTAL MESSAGES</span>
            <strong>{totalMessages}</strong>
          </div>

          <div className="dashboard-stat">
            <span>CONVERSATIONS</span>
            <strong>{totalConversations}</strong>
          </div>

          <div className="dashboard-stat">
            <span>THREATS DETECTED</span>
            <strong>{totalThreats}</strong>
          </div>

          <div className="dashboard-stat">
            <span>HIGH-RISK INCIDENTS</span>
            <strong>{highRisk}</strong>
          </div>

          <div className="dashboard-stat">
            <span>PHISHING DETECTIONS</span>
            <strong>{phishingDetections}</strong>
          </div>
        </div>

        <div className="dashboard-layout">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <h3>Risk Overview</h3>
                <span>Security incidents by risk level</span>
              </div>

              <span>{totalRisk} incidents</span>
            </div>

            <div className="dashboard-risk-grid">
              <div className="dashboard-risk-item">
                <span>HIGH</span>
                <strong>{highRisk}</strong>
              </div>

              <div className="dashboard-risk-item">
                <span>MEDIUM</span>
                <strong>{mediumRisk}</strong>
              </div>

              <div className="dashboard-risk-item">
                <span>LOW</span>
                <strong>{lowRisk}</strong>
              </div>
            </div>

            <div className="dashboard-bars">
              <div className="dashboard-bar-row">
                <div className="dashboard-bar-top">
                  <span>High Risk</span>
                  <strong>{highRisk}</strong>
                </div>

                <div className="dashboard-bar-track">
                  <div
                    className="dashboard-bar-fill high"
                    style={{
                      width: `${
                        totalRisk
                          ? (highRisk / totalRisk) * 100
                          : 0
                      }%`
                    }}
                  />
                </div>
              </div>

              <div className="dashboard-bar-row">
                <div className="dashboard-bar-top">
                  <span>Medium Risk</span>
                  <strong>{mediumRisk}</strong>
                </div>

                <div className="dashboard-bar-track">
                  <div
                    className="dashboard-bar-fill medium"
                    style={{
                      width: `${
                        totalRisk
                          ? (mediumRisk / totalRisk) * 100
                          : 0
                      }%`
                    }}
                  />
                </div>
              </div>

              <div className="dashboard-bar-row">
                <div className="dashboard-bar-top">
                  <span>Low Risk</span>
                  <strong>{lowRisk}</strong>
                </div>

                <div className="dashboard-bar-track">
                  <div
                    className="dashboard-bar-fill low"
                    style={{
                      width: `${
                        totalRisk
                          ? (lowRisk / totalRisk) * 100
                          : 0
                      }%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <h3>Threat Distribution</h3>
                <span>Detected attack categories</span>
              </div>
            </div>

            {threatDistribution.length === 0 ? (
              <div className="empty-result">
                No threat distribution data available.
              </div>
            ) : (
              <div className="dashboard-threat-list">
                {threatDistribution.map((item) => (
                  <div
                    className="dashboard-threat-row"
                    key={item.threat_type}
                  >
                    <div className="dashboard-threat-label">
                      <span>{item.threat_type}</span>
                      <strong>{item.count}</strong>
                    </div>

                    <div className="dashboard-bar-track">
                      <div
                        className="dashboard-bar-fill"
                        style={{
                          width: `${
                            (item.count / maxThreatCount) * 100
                          }%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card dashboard-activity-card">
          <div className="dashboard-card-header">
            <div>
              <h3>Live Threat Activity</h3>
              <span>
                Latest security events from MongoDB
              </span>
            </div>

            <span className="dashboard-live-label">
              LIVE
            </span>
          </div>

          {recentThreats.length === 0 ? (
            <div className="empty-result">
              No recent security activity.
            </div>
          ) : (
            <div className="dashboard-activity-list">
              {recentThreats.map((item, index) => {
                const severityClass = getSeverityClass(
                  item.threat_detection?.severity
                )

                return (
                  <div
                    className="dashboard-activity"
                    key={`${item.timestamp}-${index}`}
                  >
                    <div className="dashboard-activity-top">
                      <div>
                        <strong>
                          {item.threat_detection?.threat_type ||
                            'Unknown Threat'}
                        </strong>

                        <span
                          className={`dashboard-severity ${severityClass}`}
                        >
                          {item.threat_detection?.severity ||
                            'Low'}
                        </span>
                      </div>

                      <span>
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>

                    <div className="dashboard-activity-message">
                      {item.message}
                    </div>

                    <div className="dashboard-activity-bottom">
                      <span>
                        Risk Score:{' '}
                        {item.analysis?.risk_score ?? 0}
                      </span>

                      <span>
                        Technique:{' '}
                        {item.threat_detection?.attack_technique ||
                          'Threat Detection'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h3>System Status</h3>
              <span>CyberSage security services</span>
            </div>

            <span>OPERATIONAL</span>
          </div>

          <div className="dashboard-system-grid">
            <div className="dashboard-system-card">
              <div className="dashboard-system-icon">◈</div>
              <div>
                <strong>Threat Intelligence</strong>
                <span>Operational</span>
              </div>
            </div>

            <div className="dashboard-system-card">
              <div className="dashboard-system-icon">◉</div>
              <div>
                <strong>Phishing Analysis</strong>
                <span>Operational</span>
              </div>
            </div>

            <div className="dashboard-system-card">
              <div className="dashboard-system-icon">△</div>
              <div>
                <strong>Incident Response</strong>
                <span>Operational</span>
              </div>
            </div>

            <div className="dashboard-system-card">
              <div className="dashboard-system-icon">▣</div>
              <div>
                <strong>MongoDB</strong>
                <span>Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderChatHistory = () => (
    <div className="feature-panel">
      <div className="feature-header">
        <div>
          <span className="feature-badge">SECURITY / HISTORY</span>
          <h1>Chat History</h1>
          <p>Review previous CyberSage conversations stored in MongoDB.</p>
        </div>

        <button className="secondary-button" onClick={loadChatHistory}>
          Refresh
        </button>
      </div>

      {historyLoading ? (
        <div className="empty-result">Loading chat history...</div>
      ) : historyError ? (
        <div className="analysis-error">{historyError}</div>
      ) : historyData.length === 0 ? (
        <div className="empty-result">No chat history found.</div>
      ) : (
        <div className="history-list">
          {historyData.map((item, index) => (
            <div
              className={`history-item ${
                item.role === 'user'
                  ? 'history-user'
                  : 'history-assistant'
              }`}
              key={`${item.timestamp}-${index}`}
            >
              <div className="history-avatar">
                {item.role === 'user' ? 'U' : 'AI'}
              </div>

              <div className="history-content">
                <div className="history-top">
                  <strong>
                    {item.role === 'user' ? 'You' : 'CyberSage'}
                  </strong>
                  <span>{formatTimestamp(item.timestamp)}</span>
                </div>

                <div className="history-message">
                  {item.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderKnowledgeBase = () => (
    <div className="feature-panel">
      <div className="feature-header">
        <div>
          <span className="feature-badge">SECURITY / KNOWLEDGE</span>
          <h1>Cybersecurity Knowledge Base</h1>
          <p>
            Explore cybersecurity concepts used by the CyberSage intelligence
            layer.
          </p>
        </div>
      </div>

      <input
        className="knowledge-search"
        value={knowledgeSearch}
        onChange={(event) => setKnowledgeSearch(event.target.value)}
        placeholder="Search cybersecurity topics..."
      />

      <div className="knowledge-summary">
        <div className="knowledge-summary-card">
          <span>TOPICS</span>
          <strong>{knowledgeBase.length}</strong>
        </div>

        <div className="knowledge-summary-card">
          <span>VISIBLE</span>
          <strong>{filteredKnowledge.length}</strong>
        </div>

        <div className="knowledge-summary-card">
          <span>CATEGORIES</span>
          <strong>
            {new Set(knowledgeBase.map((item) => item.category)).size}
          </strong>
        </div>
      </div>

      <div className="knowledge-grid">
        {filteredKnowledge.map((item) => (
          <div className="knowledge-card" key={item.title}>
            <div className="knowledge-card-top">
              <div className="knowledge-icon">{item.icon}</div>
              <span className="knowledge-category">
                {item.category}
              </span>
            </div>

            <h3>{item.title}</h3>

            <p className="knowledge-description">
              {item.description}
            </p>

            <div className="knowledge-content">
              {item.content}
            </div>

            <div className="knowledge-tags">
              {item.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="feature-panel">
      <div className="feature-header">
        <div>
          <span className="feature-badge">SYSTEM / SETTINGS</span>
          <h1>CyberSage Settings</h1>
          <p>Manage your CyberSage workspace and security preferences.</p>
        </div>
      </div>

      <div className="settings-profile">
        <div className="settings-avatar">A</div>

        <div className="settings-profile-info">
          <h3>Administrator</h3>
          <p>CyberSage Security Workspace</p>
          <span>admin</span>
        </div>

        <div className="settings-status">
          <span></span>
          Online
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <h3>Platform Configuration</h3>
          <p>Current CyberSage environment information.</p>
        </div>

        <div className="settings-grid">
          <div className="settings-card">
            <span>VERSION</span>
            <strong>1.0.0</strong>
            <small>Current release</small>
          </div>

          <div className="settings-card">
            <span>BACKEND</span>
            <strong>FastAPI</strong>
            <small>Python API service</small>
          </div>

          <div className="settings-card">
            <span>DATABASE</span>
            <strong>MongoDB</strong>
            <small>Local persistence</small>
          </div>

          <div className="settings-card">
            <span>AI ENGINE</span>
            <strong>NLP + RAG</strong>
            <small>Threat intelligence</small>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <h3>Security Preferences</h3>
          <p>Control analysis and notification behavior.</p>
        </div>

        <div className="settings-list">
          <div className="settings-row">
            <div>
              <strong>Security Notifications</strong>
              <span>Receive security activity notifications.</span>
            </div>

            <button
              className={`settings-toggle ${
                notifications ? 'active' : ''
              }`}
              onClick={() => setNotifications(!notifications)}
            >
              <span></span>
            </button>
          </div>

          <div className="settings-row">
            <div>
              <strong>Automatic Threat Analysis</strong>
              <span>Analyze security indicators automatically.</span>
            </div>

            <button
              className={`settings-toggle ${
                autoAnalysis ? 'active' : ''
              }`}
              onClick={() => setAutoAnalysis(!autoAnalysis)}
            >
              <span></span>
            </button>
          </div>

          <div className="settings-row">
            <div>
              <strong>Authentication</strong>
              <span>JWT-based API authentication.</span>
            </div>

            <span className="settings-enabled">ENABLED</span>
          </div>

          <div className="settings-row">
            <div>
              <strong>Threat Intelligence</strong>
              <span>Threat classification and phishing analysis.</span>
            </div>

            <span className="settings-enabled">ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-section-header">
          <h3>Service Status</h3>
          <p>Core CyberSage services.</p>
        </div>

        <div className="service-status-grid">
          <div className="service-card">
            <div className="service-icon">◈</div>
            <div>
              <strong>FastAPI</strong>
              <span>Backend API</span>
            </div>
            <b>ONLINE</b>
          </div>

          <div className="service-card">
            <div className="service-icon">▣</div>
            <div>
              <strong>MongoDB</strong>
              <span>Data storage</span>
            </div>
            <b>ONLINE</b>
          </div>

          <div className="service-card">
            <div className="service-icon">◉</div>
            <div>
              <strong>NLP Engine</strong>
              <span>Intent classification</span>
            </div>
            <b>ONLINE</b>
          </div>
        </div>
      </div>
    </div>
  )

  const renderThreatAnalysis = () => (
    <div className="feature-panel">
      <div className="feature-header">
        <div>
          <span className="feature-badge">SECURITY / THREAT INTELLIGENCE</span>
          <h1>Threat Analysis</h1>
          <p>
            Analyze suspicious messages, URLs, and potential phishing activity.
          </p>
        </div>
      </div>

      <div className="analysis-input-card">
        <label className="analysis-label">MESSAGE OR SECURITY EVENT</label>

        <textarea
          value={analysisInput}
          onChange={(event) => setAnalysisInput(event.target.value)}
          placeholder="Paste a suspicious email, message, URL, or security event..."
        />

        <button
          className="analysis-button"
          onClick={analyzeThreat}
          disabled={analysisLoading}
        >
          {analysisLoading ? 'Analyzing...' : 'Analyze Threat'}
        </button>
      </div>

      {analysisData?.error ? (
        <div className="analysis-error">{analysisData.error}</div>
      ) : null}

      {analysisData && !analysisData.error ? (
        <div className="analysis-results">
          <div className="analysis-result-grid">
            <div className="result-card">
              <span>THREAT TYPE</span>
              <strong>{analysisData.threat_type}</strong>
            </div>

            <div className="result-card">
              <span>SEVERITY</span>
              <strong>{analysisData.severity}</strong>
            </div>

            <div className="result-card">
              <span>RISK SCORE</span>
              <strong>{analysisData.threat_assessment?.risk_score}</strong>
            </div>

            <div className="result-card">
              <span>PHISHING PROBABILITY</span>
              <strong>
                {analysisData.threat_assessment?.phishing_probability}%
              </strong>
            </div>
          </div>

          <div className="result-section">
            <h3>Threat Assessment</h3>

            <div className="assessment-row">
              <span>Risk Level</span>
              <strong>{analysisData.threat_assessment?.risk_level}</strong>
            </div>

            <div className="assessment-row">
              <span>Attack Technique</span>
              <strong>{analysisData.attack_technique}</strong>
            </div>

            <div className="assessment-row">
              <span>Total Indicators</span>
              <strong>{analysisData.total_indicators}</strong>
            </div>
          </div>

          <div className="result-section">
            <h3>Threat Indicators</h3>

            {analysisData.threat_indicators?.map((item, index) => (
              <div className="analysis-indicator" key={index}>
                {typeof item === 'string'
                  ? item
                  : JSON.stringify(item)}
              </div>
            ))}
          </div>

          <div className="result-section">
            <h3>Detected Keywords</h3>

            <div className="knowledge-tags">
              {analysisData.detected_keywords?.map((item, index) => (
                <span key={index}>{item}</span>
              ))}
            </div>
          </div>

          <div className="result-section">
            <h3>Recommendation</h3>

            <div className="knowledge-content">
              {analysisData.recommendation}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )

  const renderIncidentResponse = () => (
    <div className="feature-panel">
      <div className="feature-header">
        <div>
          <span className="feature-badge">SECURITY / INCIDENT RESPONSE</span>
          <h1>Incident Response</h1>
          <p>
            Generate response actions for detected cybersecurity threats.
          </p>
        </div>
      </div>

      <div className="analysis-input-card">
        <label className="analysis-label">SECURITY INCIDENT</label>

        <textarea
          value={incidentInput}
          onChange={(event) => setIncidentInput(event.target.value)}
          placeholder="Describe the security incident..."
        />

        <button
          className="analysis-button"
          onClick={runIncidentResponse}
          disabled={incidentLoading}
        >
          {incidentLoading
            ? 'Generating Response...'
            : 'Generate Response'}
        </button>
      </div>

      {incidentData?.error ? (
        <div className="analysis-error">{incidentData.error}</div>
      ) : null}

      {incidentData && !incidentData.error ? (
        <div className="analysis-results">
          <div className="analysis-result-grid">
            <div className="result-card">
              <span>THREAT TYPE</span>
              <strong>{incidentData.threat_type}</strong>
            </div>

            <div className="result-card">
              <span>SEVERITY</span>
              <strong>{incidentData.severity}</strong>
            </div>

            <div className="result-card">
              <span>ATTACK TECHNIQUE</span>
              <strong>{incidentData.attack_technique}</strong>
            </div>
          </div>

          <div className="result-section">
            <h3>Recommended Action</h3>

            <div className="knowledge-content">
              {incidentData.recommended_action}
            </div>
          </div>

          <div className="result-section">
            <h3>Incident Response Plan</h3>

            <div className="knowledge-content">
              {typeof incidentData.incident_response === 'string'
                ? incidentData.incident_response
                : JSON.stringify(
                    incidentData.incident_response,
                    null,
                    2
                  )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )

  const renderAssistant = () => (
    <div className="dashboard-layout">
      <div className="chat-panel">
        <div className="chat-header">
          <div>
            <span className="feature-badge">AI / CYBERSAGE</span>
            <h1>AI Security Assistant</h1>
            <p>Ask CyberSage anything about cybersecurity.</p>
          </div>
        </div>

        <div className="messages">
          {messages.map((item, index) => (
            <div
              className={`message ${
                item.role === 'user'
                  ? 'message-user'
                  : 'message-assistant'
              }`}
              key={index}
            >
              <div className="message-avatar">
                {item.role === 'user' ? 'U' : 'AI'}
              </div>

              <div className="message-content">
                <div className="message-role">
                  {item.role === 'user' ? 'You' : 'CyberSage'}
                </div>

                <div className="message-text">
                  {item.content}
                </div>
              </div>
            </div>
          ))}

          {loading ? (
            <div className="message message-assistant">
              <div className="message-avatar">AI</div>

              <div className="message-content">
                <div className="message-role">CyberSage</div>
                <div className="message-text">Analyzing...</div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="chat-input-area">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a cybersecurity question..."
          />

          <button
            className="analysis-button"
            onClick={sendMessage}
            disabled={loading || !message.trim()}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      <div className="security-panel">
        <div className="security-panel-header">
          <span className="feature-badge">LIVE SECURITY</span>
          <h2>Security Monitor</h2>
        </div>

        {!securityData ? (
          <div className="empty-result">
            Send a message to view live threat intelligence.
          </div>
        ) : (
          <>
            <div className="risk-monitor">
              <span>RISK LEVEL</span>
              <strong className={riskColor}>
                {riskLevel}
              </strong>
              <b>{riskScore}</b>
            </div>

            <div className="assessment-row">
              <span>Intent</span>
              <strong>{securityData.intent}</strong>
            </div>

            <div className="assessment-row">
              <span>Confidence</span>
              <strong>
                {(securityData.confidence * 100).toFixed(1)}%
              </strong>
            </div>

            <div className="assessment-row">
              <span>Phishing Probability</span>
              <strong>{phishingProbability}%</strong>
            </div>

            <div className="assessment-row">
              <span>Threat Type</span>
              <strong>{threat?.threat_type}</strong>
            </div>

            <div className="assessment-row">
              <span>Severity</span>
              <strong>{threat?.severity}</strong>
            </div>

            {phishing?.indicators?.length > 0 ? (
              <div className="result-section">
                <h3>Indicators</h3>

                {phishing.indicators.map((item, index) => (
                  <div
                    className="analysis-indicator"
                    key={index}
                  >
                    {typeof item === 'string'
                      ? item
                      : JSON.stringify(item)}
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C</div>

          <div>
            <strong>CyberSage</strong>
            <span>AI SECURITY PLATFORM</span>
          </div>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-title">WORKSPACE</span>

          <button
            className={`nav-item ${
              activeView === 'dashboard' ? 'active' : ''
            }`}
            onClick={openDashboard}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={`nav-item ${
              activeView === 'assistant' ? 'active' : ''
            }`}
            onClick={() => setActiveView('assistant')}
          >
            <span>◉</span>
            AI Assistant
          </button>

          <button
            className={`nav-item ${
              activeView === 'threat' ? 'active' : ''
            }`}
            onClick={() => setActiveView('threat')}
          >
            <span>◈</span>
            Threat Analysis
          </button>

          <button
            className={`nav-item ${
              activeView === 'incident' ? 'active' : ''
            }`}
            onClick={() => setActiveView('incident')}
          >
            <span>△</span>
            Incident Response
          </button>

          <button
            className={`nav-item ${
              activeView === 'history' ? 'active' : ''
            }`}
            onClick={openChatHistory}
          >
            <span>◫</span>
            Chat History
          </button>
        </div>

        <div className="sidebar-section">
          <span className="sidebar-title">SECURITY</span>

          <button
            className={`nav-item ${
              activeView === 'knowledge' ? 'active' : ''
            }`}
            onClick={() => setActiveView('knowledge')}
          >
            <span>▤</span>
            Knowledge Base
          </button>

          <button
            className={`nav-item ${
              activeView === 'settings' ? 'active' : ''
            }`}
            onClick={() => setActiveView('settings')}
          >
            <span>⚙</span>
            Settings
          </button>
        </div>

        <div className="sidebar-bottom">
          <button
            className="new-chat-button"
            onClick={() => {
              setMessages([
                {
                  role: 'assistant',
                  content:
                    'Welcome to CyberSage. I am your AI cybersecurity assistant. Ask me about phishing, malware, ransomware, network security, account security, or any cybersecurity concern.'
                }
              ])

              setSecurityData(null)
              setActiveView('assistant')
            }}
          >
            + New Security Chat
          </button>

          <div className="sidebar-status">
            <span></span>
            CyberSage Online
          </div>
        </div>
      </aside>

      <main className="main-content">
        {activeView === 'dashboard'
          ? renderDashboard()
          : activeView === 'assistant'
            ? renderAssistant()
            : activeView === 'threat'
              ? renderThreatAnalysis()
              : activeView === 'incident'
                ? renderIncidentResponse()
                : activeView === 'history'
                  ? renderChatHistory()
                  : activeView === 'knowledge'
                    ? renderKnowledgeBase()
                    : renderSettings()}
      </main>
    </div>
  )
}

export default App