import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '' // Use service role key for backend
);

// Initialize OpenAI client (replacing Cloudflare AI Gateway)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================================
// MIDDLEWARE: Authenticate user
// ============================================================================
async function authenticateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user to request
    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// CHAT ENDPOINTS
// ============================================================================

// Send chat message
app.post('/api/chat/:sessionId/chat', authenticateUser, async (req, res) => {
  const { sessionId } = req.params;
  const { message } = req.body;
  const user = (req as any).user;

  try {
    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Save user message
    const { error: msgError } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      });

    if (msgError) throw msgError;

    // Get conversation history
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true })
      .limit(50); // Limit context window

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: mapModelName(session.model),
      messages: messages?.map(m => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })) || [],
      stream: true,
    });

    // Set up SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let fullResponse = '';

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }

    // Save assistant message
    await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date().toISOString(),
      });

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat processing failed' });
  }
});

// Get messages
app.get('/api/chat/:sessionId/messages', authenticateUser, async (req, res) => {
  const { sessionId } = req.params;
  const user = (req as any).user;

  try {
    // Verify session belongs to user
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Clear messages
app.delete('/api/chat/:sessionId/clear', authenticateUser, async (req, res) => {
  const { sessionId } = req.params;
  const user = (req as any).user;

  try {
    // Verify session belongs to user
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single();

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Clear messages error:', error);
    res.status(500).json({ error: 'Failed to clear messages' });
  }
});

// ============================================================================
// SESSION ENDPOINTS
// ============================================================================

// List sessions
app.get('/api/sessions', authenticateUser, async (req, res) => {
  const user = (req as any).user;

  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('last_active', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('List sessions error:', error);
    res.status(500).json({ error: 'Failed to list sessions' });
  }
});

// Create session
app.post('/api/sessions', authenticateUser, async (req, res) => {
  const user = (req as any).user;
  const { model = 'gemini-2.5-flash' } = req.body;

  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: user.id,
        title: 'New Chat',
        model,
      })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Delete session
app.delete('/api/sessions/:sessionId', authenticateUser, async (req, res) => {
  const { sessionId } = req.params;
  const user = (req as any).user;

  try {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', user.id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

// Update session title
app.put('/api/sessions/:sessionId/title', authenticateUser, async (req, res) => {
  const { sessionId } = req.params;
  const { title } = req.body;
  const user = (req as any).user;

  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ title })
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Update title error:', error);
    res.status(500).json({ error: 'Failed to update title' });
  }
});

// Update session model
app.post('/api/chat/:sessionId/model', authenticateUser, async (req, res) => {
  const { sessionId } = req.params;
  const { model } = req.body;
  const user = (req as any).user;

  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ model })
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Update model error:', error);
    res.status(500).json({ error: 'Failed to update model' });
  }
});

// ============================================================================
// COMMUNITY ENDPOINTS
// ============================================================================

// Get community resources
app.get('/api/community/resources', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('community_resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get resources error:', error);
    res.status(500).json({ error: 'Failed to get resources' });
  }
});

// Get anonymized insights
app.get('/api/community/insights', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('anonymized_insights')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ error: 'Failed to get insights' });
  }
});

// Submit anonymized insight
app.post('/api/community/insights', authenticateUser, async (req, res) => {
  const { text } = req.body;

  try {
    const { data, error } = await supabase
      .from('anonymized_insights')
      .insert({ text })
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Submit insight error:', error);
    res.status(500).json({ error: 'Failed to submit insight' });
  }
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function mapModelName(model: string): string {
  // Map Gemini model names to OpenAI equivalents
  const modelMap: Record<string, string> = {
    'gemini-2.5-flash': 'gpt-4o-mini',
    'gemini-2.5-pro': 'gpt-4o',
    'gemini-2.0-flash': 'gpt-4o-mini',
  };

  return modelMap[model] || 'gpt-4o-mini';
}

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
