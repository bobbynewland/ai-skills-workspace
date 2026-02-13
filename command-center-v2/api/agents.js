// Agent Status API Route for Vercel
// Returns real-time agent swarm status

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    // Get agent status from OpenClaw gateway
    const { execSync } = await import('child_process')
    
    let agents = []
    let apiUsage = { total: 0, remaining: 0 }
    
    try {
      // Try to get actual agent status
      const result = execSync('openclaw agents status --json 2>/dev/null', { encoding: 'utf8', timeout: 5000 })
      agents = JSON.parse(result)
    } catch (e) {
      // Mock data for demo
      agents = [
        { 
          id: 'research', 
          name: 'Scout', 
          status: 'active', 
          role: 'Research', 
          tasks: 12,
          currentTask: 'Analyzing competitor features',
          uptime: '2h 34m',
          memory: '45%'
        },
        { 
          id: 'engineer', 
          name: 'Builder', 
          status: 'idle', 
          role: 'Engineering', 
          tasks: 3,
          currentTask: null,
          uptime: '5h 12m',
          memory: '32%'
        },
        { 
          id: 'creative', 
          name: 'Artist', 
          status: 'active', 
          role: 'Creative', 
          tasks: 8,
          currentTask: 'Generating UI mockups',
          uptime: '1h 45m',
          memory: '58%'
        }
      ]
    }
    
    try {
      // Get API usage
      const usageResult = execSync('openclaw gateway usage --json 2>/dev/null', { encoding: 'utf8', timeout: 3000 })
      apiUsage = JSON.parse(usageResult)
    } catch (e) {
      // Mock usage
      apiUsage = {
        total: 1000,
        remaining: 743,
        modelUsage: {
          'MiniMax-M2.5': { calls: 234, tokens: 45678 },
          'Kimi-K2.5': { calls: 156, tokens: 23456 },
          'Gemini-2.5': { calls: 67, tokens: 8901 }
        }
      }
    }

    return res.status(200).json({
      agents,
      apiUsage,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Agent status error:', error)
    res.status(500).json({ error: error.message })
  }
}
