// routes/journal.js - Journal Entry API Routes
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { asyncHandler } from '../middleware/errorHandler.js';
import Joi from 'joi';

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Validation schemas
const createJournalSchema = Joi.object({
  text: Joi.string().required().min(1).max(10000),
  sentiment_score: Joi.number().optional().min(-1).max(1),
  art_style: Joi.string().optional().max(100),
  art_seed: Joi.string().optional().max(200)
});

const updateJournalSchema = Joi.object({
  text: Joi.string().optional().min(1).max(10000),
  sentiment_score: Joi.number().optional().min(-1).max(1),
  art_style: Joi.string().optional().max(100),
  art_seed: Joi.string().optional().max(200)
});

/**
 * GET /api/journal/entries
 * Get all journal entries for the authenticated user
 */
router.get('/entries', asyncHandler(async (req, res) => {
  const { limit = 50, offset = 0, search } = req.query;

  let query = supabase
    .from('journal_entries')
    .select('*', { count: 'exact' })
    .eq('user_id', req.userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike('text', `%${search}%`);
  }

  const { data, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch entries', details: error.message });
  }

  res.json({
    entries: data,
    total: count,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
}));

/**
 * GET /api/journal/entries/:id
 * Get a specific journal entry
 */
router.get('/entries/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.userId)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  res.json({ entry: data });
}));

/**
 * POST /api/journal/entries
 * Create a new journal entry
 */
router.post('/entries', asyncHandler(async (req, res) => {
  const { error: validationError, value } = createJournalSchema.validate(req.body);
  
  if (validationError) {
    return res.status(400).json({ error: 'Validation failed', details: validationError.details });
  }

  // Analyze sentiment if not provided
  let sentimentScore = value.sentiment_score;
  if (!sentimentScore) {
    sentimentScore = await analyzeSentiment(value.text);
  }

  // Generate art seed if not provided
  let artSeed = value.art_seed;
  if (!artSeed) {
    artSeed = generateArtSeed(value.text, sentimentScore);
  }

  const entryData = {
    user_id: req.userId,
    text: value.text,
    sentiment_score: sentimentScore,
    art_style: value.art_style || determineArtStyle(sentimentScore),
    art_seed: artSeed
  };

  const { data, error } = await supabase
    .from('journal_entries')
    .insert([entryData])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to create entry', details: error.message });
  }

  res.status(201).json({
    message: 'Journal entry created',
    entry: data
  });
}));

/**
 * PATCH /api/journal/entries/:id
 * Update a journal entry
 */
router.patch('/entries/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error: validationError, value } = updateJournalSchema.validate(req.body);
  
  if (validationError) {
    return res.status(400).json({ error: 'Validation failed', details: validationError.details });
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .update(value)
    .eq('id', id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) {
    return res.status(404).json({ error: 'Entry not found or update failed' });
  }

  res.json({
    message: 'Entry updated',
    entry: data
  });
}));

/**
 * DELETE /api/journal/entries/:id
 * Delete a journal entry
 */
router.delete('/entries/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', req.userId);

  if (error) {
    return res.status(500).json({ error: 'Failed to delete entry', details: error.message });
  }

  res.json({ message: 'Entry deleted successfully' });
}));

/**
 * GET /api/journal/stats
 * Get journal statistics
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('sentiment_score, created_at')
    .eq('user_id', req.userId);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }

  const totalEntries = data.length;
  const avgSentiment = totalEntries > 0 
    ? data.reduce((sum, e) => sum + (e.sentiment_score || 0), 0) / totalEntries 
    : 0;

  // Group by month
  const byMonth = data.reduce((acc, entry) => {
    const month = new Date(entry.created_at).toISOString().slice(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  res.json({
    totalEntries,
    averageSentiment: avgSentiment.toFixed(2),
    byMonth,
    moodTrend: calculateMoodTrend(data)
  });
}));

// Helper functions
async function analyzeSentiment(text) {
  // Simple sentiment analysis (replace with AI service like OpenAI)
  const positiveWords = ['happy', 'grateful', 'excited', 'calm', 'focused', 'productive'];
  const negativeWords = ['stressed', 'anxious', 'tired', 'sad', 'frustrated'];
  
  const lowerText = text.toLowerCase();
  let score = 0;
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 0.2;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 0.2;
  });
  
  return Math.max(-1, Math.min(1, score));
}

function generateArtSeed(text, sentiment) {
  // Generate a deterministic seed based on text and sentiment
  const hash = text.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return `${hash}-${Math.round(sentiment * 100)}`;
}

function determineArtStyle(sentiment) {
  if (sentiment > 0.5) return 'vibrant';
  if (sentiment > 0) return 'calm';
  if (sentiment > -0.5) return 'muted';
  return 'dark';
}

function calculateMoodTrend(entries) {
  if (entries.length < 2) return 'stable';
  
  const recent = entries.slice(0, 5);
  const older = entries.slice(5, 10);
  
  const recentAvg = recent.reduce((sum, e) => sum + (e.sentiment_score || 0), 0) / recent.length;
  const olderAvg = older.length > 0 
    ? older.reduce((sum, e) => sum + (e.sentiment_score || 0), 0) / older.length 
    : recentAvg;
  
  if (recentAvg > olderAvg + 0.2) return 'improving';
  if (recentAvg < olderAvg - 0.2) return 'declining';
  return 'stable';
}

export default router;