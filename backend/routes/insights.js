// routes/insights.js - AI Insights API Routes
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * GET /api/insights/dashboard
 * Get comprehensive dashboard insights
 */
router.get('/dashboard', asyncHandler(async (req, res) => {
  const userId = req.userId;
  
  // Fetch all relevant data
  const [focusData, journalData, challengeData, profileData] = await Promise.all([
    getFocusInsights(userId),
    getJournalInsights(userId),
    getChallengeInsights(userId),
    getUserProfile(userId)
  ]);

  // Calculate Aura Score (0-100)
  const auraScore = calculateAuraScore(focusData, journalData, challengeData);

  res.json({
    auraScore,
    focus: focusData,
    journal: journalData,
    challenges: challengeData,
    profile: profileData,
    generatedAt: new Date().toISOString()
  });
}));

/**
 * GET /api/insights/weekly-summary
 * Get AI-generated weekly summary
 */
router.get('/weekly-summary', asyncHandler(async (req, res) => {
  const userId = req.userId;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Get week's data
  const { data: sessions } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', weekAgo.toISOString())
    .eq('completed', true);

  const { data: entries } = await supabase
    .from('journal_entries')
    .select('sentiment_score, created_at')
    .eq('user_id', userId)
    .gte('created_at', weekAgo.toISOString());

  // Generate summary
  const summary = generateWeeklySummary(sessions, entries);

  res.json({
    period: 'week',
    startDate: weekAgo.toISOString(),
    endDate: new Date().toISOString(),
    summary
  });
}));

/**
 * GET /api/insights/productivity-patterns
 * Get productivity patterns and recommendations
 */
router.get('/productivity-patterns', asyncHandler(async (req, res) => {
  const userId = req.userId;

  // Get last 30 days of focus sessions
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: sessions } = await supabase
    .from('focus_sessions')
    .select('*')
    .eq('user_id', userId)
    .gte('start_time', thirtyDaysAgo.toISOString())
    .eq('completed', true);

  if (!sessions || sessions.length === 0) {
    return res.json({
      message: 'Not enough data yet. Complete more focus sessions to see patterns.',
      patterns: []
    });
  }

  // Analyze patterns
  const patterns = analyzeProductivityPatterns(sessions);

  res.json({
    period: 'last_30_days',
    totalSessions: sessions.length,
    patterns,
    recommendations: generateRecommendations(patterns)
  });
}));

/**
 * GET /api/insights/mood-trends
 * Get mood trends from journal entries
 */
router.get('/mood-trends', asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { days = 30 } = req.query;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const { data: entries } = await supabase
    .from('journal_entries')
    .select('sentiment_score, created_at')
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString())
    .order('created_at', { ascending: true });

  if (!entries || entries.length === 0) {
    return res.json({
      message: 'No journal entries found',
      trends: []
    });
  }

  // Calculate trends
  const trends = calculateMoodTrends(entries);

  res.json({
    period: `${days}_days`,
    entriesAnalyzed: entries.length,
    trends,
    averageMood: (entries.reduce((sum, e) => sum + (e.sentiment_score || 0), 0) / entries.length).toFixed(2),
    moodStability: calculateMoodStability(entries)
  });
}));

/**
 * GET /api/insights/top-distractors
 * Get top distraction sources (placeholder - would need browser extension data)
 */
router.get('/top-distractors', asyncHandler(async (req, res) => {
  // This would integrate with browser extension tracking
  // For now, return sample data
  res.json({
    message: 'Install browser extension for detailed distraction tracking',
    topDistractors: [
      { site: 'Social Media', timeMinutes: 45, percentage: 35 },
      { site: 'News Sites', timeMinutes: 32, percentage: 25 },
      { site: 'Messaging', timeMinutes: 28, percentage: 22 },
      { site: 'Video Streaming', timeMinutes: 18, percentage: 14 },
      { site: 'Shopping', timeMinutes: 5, percentage: 4 }
    ]
  });
}));

// Helper functions
async function getFocusInsights(userId) {
  const { data: sessions } = await supabase
    .from('focus_sessions')
    .select('duration, completed, start_time')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('start_time', { ascending: false })
    .limit(100);

  const totalMinutes = sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) || 0;
  
  return {
    totalHours: (totalMinutes / 60).toFixed(1),
    totalSessions: sessions?.length || 0,
    averageSessionLength: sessions?.length > 0 ? Math.round(totalMinutes / sessions.length) : 0,
    last7Days: calculateLast7DaysFocus(sessions || [])
  };
}

async function getJournalInsights(userId) {
  const { data: entries } = await supabase
    .from('journal_entries')
    .select('sentiment_score, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  const avgSentiment = entries?.length > 0
    ? entries.reduce((sum, e) => sum + (e.sentiment_score || 0), 0) / entries.length
    : 0;

  return {
    totalEntries: entries?.length || 0,
    averageSentiment: avgSentiment.toFixed(2),
    recentMood: avgSentiment > 0.3 ? 'Positive' : avgSentiment > -0.3 ? 'Neutral' : 'Needs Support'
  };
}

async function getChallengeInsights(userId) {
  const { data: challenges } = await supabase
    .from('user_challenges')
    .select('*, challenges(*)')
    .eq('user_id', userId);

  const completed = challenges?.filter(c => c.completed).length || 0;
  const active = challenges?.filter(c => !c.completed).length || 0;

  return {
    totalChallenges: challenges?.length || 0,
    completed,
    active,
    completionRate: challenges?.length > 0 ? ((completed / challenges.length) * 100).toFixed(0) : 0
  };
}

async function getUserProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('name, total_focus_hours')
    .eq('id', userId)
    .single();

  return data;
}

function calculateAuraScore(focus, journal, challenges) {
  // Weighted scoring: Focus 40%, Mood 35%, Challenges 25%
  const focusScore = Math.min((parseFloat(focus.totalHours) / 50) * 40, 40);
  const moodScore = ((parseFloat(journal.averageSentiment) + 1) / 2) * 35;
  const challengeScore = (parseInt(challenges.completionRate) / 100) * 25;

  return Math.round(focusScore + moodScore + challengeScore);
}

function calculateLast7DaysFocus(sessions) {
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayTotal = sessions
      .filter(s => s.start_time.startsWith(dateStr))
      .reduce((sum, s) => sum + (s.duration || 0), 0);
    
    last7Days.push({
      date: dateStr,
      hours: (dayTotal / 60).toFixed(1)
    });
  }
  return last7Days;
}

function analyzeProductivityPatterns(sessions) {
  // Group by hour of day
  const byHour = sessions.reduce((acc, session) => {
    const hour = new Date(session.start_time).getHours();
    acc[hour] = (acc[hour] || 0) + (session.duration || 0);
    return acc;
  }, {});

  // Find peak hour
  const peakHour = Object.entries(byHour).reduce((max, [hour, minutes]) => 
    minutes > max[1] ? [parseInt(hour), minutes] : max, [0, 0]);

  // Group by day of week
  const byDay = sessions.reduce((acc, session) => {
    const day = new Date(session.start_time).getDay();
    acc[day] = (acc[day] || 0) + (session.duration || 0);
    return acc;
  }, {});

  return {
    peakProductivityHour: peakHour[0],
    peakProductivityDay: Object.entries(byDay).reduce((max, [day, minutes]) => 
      minutes > max[1] ? [parseInt(day), minutes] : max, [0, 0])[0],
    hourlyDistribution: byHour
  };
}

function generateRecommendations(patterns) {
  const recommendations = [];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  recommendations.push({
    type: 'peak_time',
    message: `Your peak productivity is at ${patterns.peakProductivityHour}:00. Schedule important tasks during this time.`
  });

  recommendations.push({
    type: 'best_day',
    message: `${days[patterns.peakProductivityDay]} is your most productive day. Plan deep work sessions accordingly.`
  });

  return recommendations;
}

function calculateMoodTrends(entries) {
  // Calculate 7-day moving average
  const trends = [];
  for (let i = 0; i < entries.length; i++) {
    const window = entries.slice(Math.max(0, i - 6), i + 1);
    const avg = window.reduce((sum, e) => sum + (e.sentiment_score || 0), 0) / window.length;
    trends.push({
      date: entries[i].created_at.split('T')[0],
      movingAverage: avg.toFixed(2)
    });
  }
  return trends;
}

function calculateMoodStability(entries) {
  if (entries.length < 2) return 'stable';
  
  const scores = entries.map(e => e.sentiment_score || 0);
  const variance = scores.reduce((sum, score) => {
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    return sum + Math.pow(score - mean, 2);
  }, 0) / scores.length;

  if (variance < 0.1) return 'very_stable';
  if (variance < 0.3) return 'stable';
  if (variance < 0.5) return 'somewhat_variable';
  return 'highly_variable';
}

function generateWeeklySummary(sessions, entries) {
  const totalFocusHours = sessions?.reduce((sum, s) => sum + (s.duration || 0), 0) / 60 || 0;
  const avgMood = entries?.length > 0
    ? entries.reduce((sum, e) => sum + (e.sentiment_score || 0), 0) / entries.length
    : 0;

  let summary = `This week, you completed ${totalFocusHours.toFixed(1)} hours of focused work across ${sessions?.length || 0} sessions. `;

  if (avgMood > 0.3) {
    summary += "Your journal entries show a positive emotional trajectory, with consistent feelings of calm and focus. ";
  } else if (avgMood > -0.3) {
    summary += "Your mood has been relatively balanced this week. ";
  } else {
    summary += "Your entries suggest some challenges this week. Consider reaching out for support. ";
  }

  if (sessions && sessions.length > 7) {
    summary += "You're maintaining excellent consistency with your focus practice. Keep up the great work!";
  } else if (sessions && sessions.length > 3) {
    summary += "You're building good momentum. Try to maintain this consistency.";
  } else {
    summary += "Consider setting daily focus goals to build more consistent habits.";
  }

  return summary;
}

export default router;