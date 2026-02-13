// Google Workspace Integration Service
// Uses Google OAuth2 for Gmail, Calendar, and Drive APIs

const GOOGLE_CLIENT_ID = '470490782527-g9o6fspf2thaukfuf3rpau2f6lb831e4.apps.googleusercontent.com'
const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
].join(' ')

class GoogleWorkspaceService {
  constructor() {
    this.accessToken = null
    this.tokenClient = null
    this.initialized = false
  }

  async initialize() {
    if (this.initialized) return
    
    return new Promise((resolve) => {
      // Load Google Identity Services
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.onload = () => {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: SCOPES,
          callback: (response) => {
            if (response.access_token) {
              this.accessToken = response.access_token
            }
          }
        })
        this.initialized = true
        resolve()
      }
      document.body.appendChild(script)
    })
  }

  async authorize() {
    if (!this.tokenClient) await this.initialize()
    return new Promise((resolve) => {
      this.tokenClient.callback = (response) => {
        if (response.access_token) {
          this.accessToken = response.access_token
          resolve(true)
        } else {
          resolve(false)
        }
      }
      this.tokenClient.requestAccessToken({ prompt: 'consent' })
    })
  }

  async makeRequest(endpoint, method = 'GET') {
    if (!this.accessToken) {
      await this.authorize()
    }
    
    const response = await fetch(`https://www.googleapis.com${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    return response.json()
  }

  // Gmail: Get unread count and recent messages
  async getGmailData() {
    try {
      const response = await this.makeRequest('/gmail/v1/users/me/messages?maxResults=5')
      const unreadResponse = await this.makeRequest('/gmail/v1/users/me/messages?labelIds=UNREAD&maxResults=1')
      
      return {
        unreadCount: unreadResponse.resultSizeEstimate || 0,
        recentEmails: response.messages || [],
        connected: true
      }
    } catch (error) {
      console.log('Gmail not connected, using mock data')
      return {
        unreadCount: 5,
        recentEmails: [
          { id: '1', subject: 'Project Update', from: 'team@example.com', snippet: 'Latest updates on...' },
          { id: '2', subject: 'Meeting Notes', from: 'colleague@example.com', snippet: 'Notes from today\'s...' },
        ],
        connected: false
      }
    }
  }

  // Calendar: Get today's events
  async getCalendarData() {
    try {
      const today = new Date()
      const timeMin = new Date(today.setHours(0, 0, 0, 0)).toISOString()
      const timeMax = new Date(today.setHours(23, 59, 59, 999)).toISOString()
      
      const response = await this.makeRequest(
        `/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&maxResults=10`
      )
      
      return {
        events: response.items || [],
        connected: true
      }
    } catch (error) {
      console.log('Calendar not connected, using mock data')
      return {
        events: [
          { id: '1', summary: 'Team Standup', start: { dateTime: '09:00' }, end: { dateTime: '09:30' } },
          { id: '2', summary: 'Project Review', start: { dateTime: '14:00' }, end: { dateTime: '15:00' } },
        ],
        connected: false
      }
    }
  }

  // Drive: Get recent files
  async getDriveData() {
    try {
      const response = await this.makeRequest('/drive/v3/files?pageSize=10&orderBy=modifiedTime desc')
      
      return {
        files: response.files || [],
        connected: true
      }
    } catch (error) {
      console.log('Drive not connected, using mock data')
      return {
        files: [
          { id: '1', name: 'Project Specs.pdf', mimeType: 'application/pdf', modifiedTime: '2024-01-15' },
          { id: '2', name: 'Design Assets.zip', mimeType: 'application/zip', modifiedTime: '2024-01-14' },
        ],
        connected: false
      }
    }
  }

  // Get all workspace data
  async getAllData() {
    const [gmail, calendar, drive] = await Promise.all([
      this.getGmailData(),
      this.getCalendarData(),
      this.getDriveData()
    ])
    
    return { gmail, calendar, drive }
  }
}

export const googleWorkspace = new GoogleWorkspaceService()
export default googleWorkspace
