// Kimi K2.5 API Client for Mission Control
// Uses NVIDIA NIM endpoint: https://integrate.api.nvidia.com/v1/chat/completions

const API_KEY = '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';

const ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'moonshotai/kimi-k2.5';

export async function kimiChat(messages, options = {}) {
  const { 
    model = MODEL, 
    max_tokens = 16384, 
    temperature = 0.7,
    stream = false,
    thinking = false
  } = options;
  
  const payload = {
    model,
    messages,
    max_tokens,
    temperature,
    top_p: 1.0,
    stream,
    chat_template_kwargs: { thinking }
  };

  const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': stream ? 'text/event-stream' : 'application/json'
  };

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (stream) {
      return response; // Return readable stream for chunk processing
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || data.choices?.[0]?.text || '';
  } catch (error) {
    console.error('Kimi API error:', error);
    throw error;
  }
}

export async function kimiCode(prompt, language = 'javascript') {
  const systemPrompt = `You are an expert coding assistant. Write clean, production-ready code.
${language === 'javascript' || language === 'react' ? 'Use modern ES6+, React hooks, and functional components.' : ''}
${language === 'python' ? 'Follow PEP 8 style guide.' : ''}
Return only the code with brief comments where needed.`;

  return kimiChat([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt }
  ], { 
    temperature: 0.1, 
    max_tokens: 8192,
    thinking: true 
  });
}

export async function kimiExplain(code) {
  return kimiChat([
    { role: 'system', content: 'Explain code concisely in 2-3 sentences. Focus on functionality and key implementation details.' },
    { role: 'user', content: `Explain this code:\n\n${code}` }
  ], { temperature: 0.3, max_tokens: 500 });
}

export async function kimiRefactor(code, goal) {
  return kimiChat([
    { role: 'system', content: 'Refactor code to meet the goal while maintaining functionality. Return only the refactored code.' },
    { role: 'user', content: `Refactor:\n\nGoal: ${goal}\n\nCode:\n${code}` }
  ], { temperature: 0.2, max_tokens: 4096 });
}

export async function kimiStreamResponse(messages, onChunk) {
  const response = await kimiChat(messages, { stream: true, thinking: false });
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') break;
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) onChunk(content);
        } catch (e) {
          // Skip non-JSON lines
        }
      }
    }
  }
}
