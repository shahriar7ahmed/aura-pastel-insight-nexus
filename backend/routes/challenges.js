// routes/challenges.js - Challenges API Routes
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * GET /api/challenges
 * Get all available challenges
 */
router.get('/', asyncHandler(async (req, res) => {
  const { data: challenges, error } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch challenges', details: error.message });
  }

  // Get user's progress for each challenge
  const { data: userChallenges } = await supabase
    .from('user_challenges')
    .select('*')
    .eq('user_id', req.userId);

  // Merge challenge data with user progress
  const enrichedChallenges = challenges.map(challenge => {
    const userProgress = userChallenges?.find(uc => uc.challenge_id === challenge.id);
    return {
      ...challenge,
      userProgress: userProgress || null,
      status: userProgress?.completed ? 'completed' : userProgress ? 'active' : 'available'
    };
  });

  res.json({ challenges: enrichedChallenges });
}));

/**
 * POST /api/challenges/:id/join
 * Join a challenge
 */
router.post('/:id/join', asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if challenge exists
  const { data: challenge, error: challengeError } = await supabase
    .from('challenges')
    .select('*')
    .eq('id', id)
    .single();

  if (challengeError || !challenge) {
    return res.status(404).json({ error: 'Challenge not found' });
  }

  // Check if already joined
  const { data: existing } = await supabase
    .from('user_challenges')
    .select('*')
    .eq('user_id', req.userId)
    .eq('challenge_id', id)
    .single();

  if (existing) {
    return res.status(400).json({ error: 'Already joined this challenge' });
  }

  // Join the challenge
  const { data, error } = await supabase
    .from('user_challenges')
    .insert([{
      user_id: req.userId,
      challenge_id: id,
      progress: 0,
      completed: false
    }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to join challenge', details: error.message });
  }

  res.status(201).json({
    message: 'Challenge joined successfully',
    userChallenge: data
  });
}));

/**
 * PATCH /api/challenges/:id/progress
 * Update challenge progress
 */
router.patch('/:id/progress', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { increment = 1 } = req.body;

  // Get current progress
  const { data: userChallenge } = await supabase
    .from('user_challenges')
    .select('*, challenges(*)')
    .eq('user_id', req.userId)
    .eq('challenge_id', id)
    .single();

  if (!userChallenge) {
    return res.status(404).json({ error: 'Not enrolled in this challenge' });
  }

  if (userChallenge.completed) {
    return res.status(400).json({ error: 'Challenge already completed' });
  }

  // Update progress
  const newProgress = userChallenge.progress + increment;
  const isCompleted = newProgress >= userChallenge.challenges.goal_value;

  const updateData = {
    progress: newProgress,
    completed: isCompleted,
    ...(isCompleted && { completed_at: new Date().toISOString() })
  };

  const { data, error } = await supabase
    .from('user_challenges')
    .update(updateData)
    .eq('user_id', req.userId)
    .eq('challenge_id', id)
    .select('*, challenges(*)')
    .single();

  if (error) {
    return res.status(500).json({ error: 'Failed to update progress', details: error.message });
  }

  res.json({
    message: isCompleted ? 'Challenge completed! 🎉' : 'Progress updated',
    userChallenge: data,
    completed: isCompleted
  });
}));

/**
 * GET /api/challenges/my
 * Get user's active and completed challenges
 */
router.get('/my', asyncHandler(async (req, res) => {
  const { status } = req.query; // active, completed, all

  let query = supabase
    .from('user_challenges')
    .select('*, challenges(*)')
    .eq('user_id', req.userId);

  if (status === 'active') {
    query = query.eq('completed', false);
  } else if (status === 'completed') {
    query = query.eq('completed', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch challenges', details: error.message });
  }

  res.json({ userChallenges: data });
}));

/**
 * GET /api/challenges/leaderboard
 * Get challenge leaderboard
 */
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const { challenge_id } = req.query;

  let query = supabase
    .from('user_challenges')
    .select('user_id, progress, completed, completed_at, profiles(name, avatar_url)')
    .order('progress', { ascending: false })
    .limit(50);

  if (challenge_id) {
    query = query.eq('challenge_id', challenge_id);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch leaderboard', details: error.message });
  }

  res.json({ leaderboard: data });
}));

/**
 * DELETE /api/challenges/:id/quit
 * Quit a challenge
 */
router.delete('/:id/quit', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('user_challenges')
    .delete()
    .eq('user_id', req.userId)
    .eq('challenge_id', id)
    .eq('completed', false); // Can't quit completed challenges

  if (error) {
    return res.status(500).json({ error: 'Failed to quit challenge', details: error.message });
  }

  res.json({ message: 'Challenge quit successfully' });
}));

export default router;