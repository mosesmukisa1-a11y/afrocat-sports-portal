const express = require('express');
const { z } = require('zod');
const prisma = require('../prisma');
const { generateTokens } = require('../middleware/auth');
const { logAudit } = require('../middleware/audit');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Generate random OTP
function generateOTP(length = 6) {
  return Math.floor(100000 + Math.random() * 900000).toString().padStart(length, '0');
}

// Request OTP
const requestOtpSchema = z.object({
  email: z.string().email()
});

router.post('/request-otp', async (req, res) => {
  try {
    const { email } = requestOtpSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    if (user.status !== 'APPROVED') {
      return res.status(403).json({
        error: {
          code: 'ACCOUNT_NOT_APPROVED',
          message: 'Account not approved. Please wait for admin approval.'
        }
      });
    }

    const code = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(process.env.OTP_EXPIRES_IN_MINUTES || '10'));

    await prisma.otpToken.create({
      data: {
        email: email.toLowerCase(),
        code,
        expiresAt
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[OTP for ${email}]: ${code}`);
    }

    await logAudit(req, 'OTP_REQUESTED', email);

    res.json({
      success: true,
      message: 'OTP sent to email'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email format',
          details: error.errors
        }
      });
    }

    console.error('Request OTP error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to send OTP'
      }
    });
  }
});

// Verify OTP
const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6)
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = verifyOtpSchema.parse(req.body);

    const otpToken = await prisma.otpToken.findFirst({
      where: {
        email: email.toLowerCase(),
        code: otp,
        used: false,
        expiresAt: {
          gt: new Date()
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!otpToken) {
      return res.status(401).json({
        error: {
          code: 'INVALID_OTP',
          message: 'Invalid or expired OTP'
        }
      });
    }

    await prisma.otpToken.update({
      where: { id: otpToken.id },
      data: { used: true }
    });

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || user.status !== 'APPROVED') {
      return res.status(403).json({
        error: {
          code: 'ACCOUNT_NOT_APPROVED',
          message: 'Account not approved'
        }
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt
      }
    });

    await logAudit(req, 'LOGIN', email);

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        memberId: user.memberId
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors
        }
      });
    }

    console.error('Verify OTP error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to verify OTP'
      }
    });
  }
});

// Refresh token
const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    const jwt = require('jsonwebtoken');
    let decoded;
    
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid refresh token'
        }
      });
    }

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return res.status(401).json({
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Refresh token expired'
        }
      });
    }

    if (tokenRecord.user.status !== 'APPROVED') {
      return res.status(403).json({
        error: {
          code: 'ACCOUNT_NOT_APPROVED',
          message: 'Account not approved'
        }
      });
    }

    const { accessToken } = generateTokens(tokenRecord.user);

    res.json({
      accessToken
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: error.errors
        }
      });
    }

    console.error('Refresh token error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to refresh token'
      }
    });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        memberships: {
          include: {
            team: true
          }
        }
      }
    });

    res.json({
      user: {
        id: user.id,
        memberId: user.memberId,
        email: user.email,
        name: user.name,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        nationality: user.nationality,
        role: user.role,
        status: user.status,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        teams: user.memberships.map(m => ({
          id: m.team.id,
          name: m.team.name,
          jerseyNumber: m.jerseyNumber
        }))
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get user'
      }
    });
  }
});

module.exports = router;

