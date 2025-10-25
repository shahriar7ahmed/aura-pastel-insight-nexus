// routes/auth.js - Authentication Routes
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
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(2).max(100).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * POST /api/auth/signup
 * Register a new user
 */
router.post('/signup', asyncHandler(async (req, res) => {
  const { error: validationError, value } = signupSchema.validate(req.body);
  
  if (validationError) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: validationError.details 
    });
  }

  const { email, password, name } = value;

  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  if (error) {
    return res.status(400).json({ 
      error: 'Signup failed', 
      message: error.message 
    });
  }

  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata.name
    }
  });
}));

/**
 * POST /api/auth/login
 * Login user (returns instructions to use Supabase client-side)
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { error: validationError } = loginSchema.validate(req.body);
  
  if (validationError) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: validationError.details 
    });
  }

  // Note: For security, actual login should be done client-side with Supabase
  res.json({
    message: 'Please use Supabase client-side authentication',
    instructions: 'Use supabase.auth.signInWithPassword() on the frontend'
  });
}));

/**
 * POST /api/auth/logout
 * Logout user (client-side operation)
 */
router.post('/logout', asyncHandler(async (req, res) => {
  res.json({
    message: 'Please use Supabase client-side logout',
    instructions: 'Use supabase.auth.signOut() on the frontend'
  });
}));

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', asyncHandler(async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Get full profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  res.json({
    user: {
      id: user.id,
      email: user.email,
      ...profile
    }
  });
}));

/**
 * POST /api/auth/reset-password
 * Request password reset
 */
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.FRONTEND_URL}/reset-password`
  });

  if (error) {
    return res.status(500).json({ 
      error: 'Failed to send reset email', 
      message: error.message 
    });
  }

  res.json({ 
    message: 'Password reset email sent. Please check your inbox.' 
  });
}));

export default router;