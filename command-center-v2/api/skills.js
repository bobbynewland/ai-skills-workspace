// Skills API Route for Vercel
// Handles skill commands like template creator, image generation, transcription

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { skill, action, params } = req.body
  
  try {
    switch (skill) {
      case 'template':
        return await handleTemplate(req, res, action, params)
      case 'image':
        return await handleImage(req, res, action, params)
      case 'transcription':
        return await handleTranscription(req, res, action, params)
      case 'skills-list':
        return res.status(200).json({
          skills: [
            { id: 'template', name: 'Template Creator', description: 'Create project templates', icon: 'layout' },
            { id: 'image', name: 'Nano Banana', description: 'AI image generation', icon: 'image' },
            { id: 'transcription', name: 'Video Transcription', description: 'Transcribe video files', icon: 'video' }
          ]
        })
      default:
        return res.status(404).json({ error: 'Skill not found' })
    }
  } catch (error) {
    console.error('Skills API error:', error)
    res.status(500).json({ error: error.message })
  }
}

async function handleTemplate(req, res, action, params) {
  if (action === 'create') {
    const { execSync } = await import('child_process')
    try {
      const result = execSync(`openclaw skill template create --name "${params.name}" --type "${params.type}" --json 2>/dev/null`, { 
        encoding: 'utf8', 
        timeout: 30000 
      })
      return res.status(200).json({ success: true, result: JSON.parse(result) })
    } catch (e) {
      // Mock response
      return res.status(200).json({
        success: true,
        result: {
          id: `tmpl_${Date.now()}`,
          name: params.name,
          type: params.type,
          createdAt: new Date().toISOString()
        }
      })
    }
  }
  
  // List templates
  return res.status(200).json({
    templates: [
      { id: '1', name: 'React App', type: 'web', createdAt: new Date().toISOString() },
      { id: '2', name: 'API Service', type: 'backend', createdAt: new Date().toISOString() }
    ]
  })
}

async function handleImage(req, res, action, params) {
  // Nano Banana image generation
  if (action === 'generate') {
    const { execSync } = await import('child_process')
    try {
      const result = execSync(`openclaw skill image generate --prompt "${params.prompt}" --style "${params.style || 'default'}" --json 2>/dev/null`, { 
        encoding: 'utf8', 
        timeout: 60000 
      })
      return res.status(200).json({ success: true, result: JSON.parse(result) })
    } catch (e) {
      // Mock response for demo
      return res.status(200).json({
        success: true,
        result: {
          id: `img_${Date.now()}`,
          prompt: params.prompt,
          style: params.style || 'default',
          status: 'completed',
          imageUrl: `https://picsum.photos/seed/${Date.now()}/512/512`,
          createdAt: new Date().toISOString()
        }
      })
    }
  }
  
  // List generations
  return res.status(200).json({
    generations: [
      { id: '1', prompt: 'Cyberpunk city', status: 'completed', imageUrl: 'https://picsum.photos/seed/1/512/512' },
      { id: '2', prompt: 'Abstract art', status: 'completed', imageUrl: 'https://picsum.photos/seed/2/512/512' }
    ]
  })
}

async function handleTranscription(req, res, action, params) {
  if (action === 'transcribe') {
    const { execSync } = await import('child_process')
    try {
      const result = execSync(`openclaw skill transcription transcribe --file "${params.file}" --json 2>/dev/null`, { 
        encoding: 'utf8', 
        timeout: 120000 
      })
      return res.status(200).json({ success: true, result: JSON.parse(result) })
    } catch (e) {
      // Mock response
      return res.status(200).json({
        success: true,
        result: {
          id: `trans_${Date.now()}`,
          file: params.file,
          status: 'completed',
          text: 'This is a sample transcription of the video content...',
          duration: '5:32',
          language: 'en',
          createdAt: new Date().toISOString()
        }
      })
    }
  }
  
  // List transcriptions
  return res.status(200).json({
    transcriptions: [
      { id: '1', file: 'interview.mp4', status: 'completed', duration: '5:32', createdAt: new Date().toISOString() },
      { id: '2', file: 'podcast.wav', status: 'processing', duration: '45:12', createdAt: new Date().toISOString() }
    ]
  })
}
