import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import validator from 'validator';

// Rate limiting middleware - prevent brute force attacks
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiter for signup
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 signups per hour per IP
  message: 'Too many accounts created, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Data sanitization against NoSQL injection
export const sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized key "${key}" in request`);
  },
});

// Input validation helpers
export const validateEmail = (email) => {
  return validator.isEmail(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (name) => {
  // Only alphanumeric, spaces, hyphens, and underscores
  return validator.matches(name, /^[a-zA-Z0-9\s\-_]{2,50}$/, 'i');
};

export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  // Remove potential XSS vectors
  return validator.escape(str).trim();
};

// Validate request body size
export const validateRequestSize = express.json({ limit: '10kb' });

// Security headers middleware
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );
  next();
};

// Request logging for security audit
export const securityLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous',
    };
    
    // Log suspicious activity
    if (res.statusCode >= 400) {
      console.warn('[SECURITY] Suspicious activity:', logEntry);
    }
  });
  next();
};

// Prevent parameter pollution
export const preventParameterPollution = (req, res, next) => {
  if (req.query) {
    for (const key in req.query) {
      if (Array.isArray(req.query[key])) {
        req.query[key] = req.query[key][0];
      }
    }
  }
  next();
};

export default {
  loginLimiter,
  apiLimiter,
  signupLimiter,
  sanitizeData,
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeString,
  securityHeaders,
  securityLogger,
  preventParameterPollution,
};
