const { Role } = require('@prisma/client');

/**
 * Role-based access control middleware
 * Usage: rbac(['ADMIN', 'MANAGER'])
 */
function rbac(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
}

/**
 * Check if user can access resource (own or has permission)
 */
function canAccessResource(user, resourceUserId, allowedRoles) {
  // Can access if it's their own resource
  if (user.id === resourceUserId) {
    return true;
  }

  // Can access if they have required role
  if (allowedRoles && allowedRoles.includes(user.role)) {
    return true;
  }

  return false;
}

module.exports = {
  rbac,
  canAccessResource
};

