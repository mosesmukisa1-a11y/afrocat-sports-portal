const prisma = require('../prisma');

/**
 * Audit log middleware
 */
async function logAudit(req, action, targetEmail = null, details = null) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: req.user?.id || null,
        actorEmail: req.user?.email || 'SYSTEM',
        action,
        targetEmail,
        details: details ? JSON.stringify(details) : null,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent']
      }
    });
  } catch (error) {
    // Don't fail request if audit logging fails
    console.error('Audit log error:', error);
  }
}

module.exports = {
  logAudit
};

