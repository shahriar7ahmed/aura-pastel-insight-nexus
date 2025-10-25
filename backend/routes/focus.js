// routes/focus.js - Focus Session API Routes
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
const createSessionSchema = Joi.object({
  task: Joi.string().required().min(1).max(500),
  category: Joi.string().optional().max(100),
  duration: Joi.number().optional().min(1).max(480) // max 8 hours
});

const updateSessionSchema = Joi.object({
  end_time: Joi.date().optional(),
  duration: Joi.number().optional().min(1).max(480),
  completed: Joi.boolean().optional()
});

/**
 * GET /api/focus/sessions
 * Get all focus sessions for the authenticated user
 */
router.get('/sessions', asyncHandler(async (req, res) => {
  const { limit = 50, offset = 0, category } = req.query;

  let query = supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', req.userId)
    .order('start_time', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error, count } = await query;

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch sessions', details: error.message });
  }

  res.json({
    sessions: data,
    total: count,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });
}));

/**
 * POST /api/focus/sessions
 * Create a new focus session
 */
router.post('/sessions', asyncHandler(async (req, res) => {
  const { error: validationError, value } = createSessionSchema.validate(req.body);
  
  if (validationError) {
    return res.status(400).json({ error: 'Validation failed', details: validationError.details });
  }

  const sessionData = {
    user_id: req.userId,
    task: value.task,
    category: value.category || 'General',
    start_time: new Date().toISOString(),
    completed: false
  };

  const { data, error } = await supabase
    .from('focus_sessions')
    .insert([sessionData])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to create session', details: error.message });
  }

  res.status(201).json({
    message: 'Focus session started',
    session: data
  });
}));

/**
 * PATCH /api/focus/sessions/:id
 * Update a focus session (complete it)
 */
router.patch('/sessions/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error: validationError, value } = updateSessionSchema.validate(req.body);
  
  if (validationError) {
    return res.status(400).json({ error: 'Validation failed', details: validationError.details });
  }

  // Check if session belongs to user
  const { data: existingSession } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', req.userId)
    .single();

  if (!existingSession) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const updateData = { ...value };
  
  // Calculate duration if end_time is provided
  if (value.end_time) {
    const startTime = new Date(existingSession.start_time);
    const endTime = new Date(value.end_time);
    updateData.duration = Math.round((endTime - startTime) / 1000 / 60); // minutes
  }

  const { data, error } = await supabase
    .from('focus_sessions')
    .update(updateData)
    .eq('id', id)
    .eq('user_id', req.userId)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to update session', details: error.message });
  }

  // Update user's total focus hours
  if (updateData.completed && updateData.duration) {
    await updateUserFocusHours(req.userId, updateData.duration / 60);
  }

  res.json({
    message: 'Session updated',
    session: data
  });
}));

/**
 * GET /api/focus/stats
 * Get focus statistics for the user
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const { period = 'week' } = req.query; // week, month, year

  let startDate = new Date();
  switch (period) {
    case 'week':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  const { data, error } = await supabase
    .from('focus_sessions')
    .select('duration, completed, category, start_time')
    .eq('user_id', req.userId)
    .gte('start_time', startDate.toISOString())
    .eq('completed', true);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
  }

  // Calculate statistics
  const totalMinutes = data.reduce((sum, session) => sum + (session.duration || 0), 0);
  const totalSessions = data.length;
  const avgSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0;
  
  // Group by category
  const byCategory = data.reduce((acc, session) => {
    const cat = session.category || 'General';
    acc[cat] = (acc[cat] || 0) + (session.duration || 0);
    return acc;
  }, {});

  // Group by day
  const byDay = data.reduce((acc, session) => {
    const day = new Date(session.start_time).toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + (session.duration || 0);
    return acc;
  }, {});

  res.json({
    period,
    totalHours: (totalMinutes / 60).toFixed(2),
    totalSessions,
    averageSessionLength: Math.round(avgSessionLength),
    byCategory,
    byDay
  });
}));

/**
 * DELETE /api/focus/sessions/:id
 * Delete a focus session
 */
router.delete('/sessions/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('focus_sessions')
    .delete()
    .eq('id', id)
    .eq('user_id', req.userId);

  if (error) {
    return res.status(500).json({ error: 'Failed to delete session', details: error.message });
  }

  res.json({ message: 'Session deleted successfully' });
}));

// Helper function to update user's total focus hours
async function updateUserFocusHours(userId, hours) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_focus_hours')
    .eq('id', userId)
    .single();

  if (profile) {
    await supabase
      .from('profiles')
      .update({ 
        total_focus_hours: (profile.total_focus_hours || 0) + hours 
      })
      .eq('id', userId);
  }
}

export default router;