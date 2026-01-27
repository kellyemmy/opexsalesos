import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore, User } from '@/store';

/**
 * ProtectedRoute Component
 * Redirects to login if user is not authenticated
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * RoleBasedRoute Component
 * Renders children only if user has required role(s)
 * Otherwise shows 403 Forbidden or redirects
 */
interface RoleBasedRouteProps {
  children: ReactNode;
  requiredRoles: User['role'] | User['role'][];
  fallback?: ReactNode;
}

export const RoleBasedRoute = ({
  children,
  requiredRoles,
  fallback,
}: RoleBasedRouteProps) => {
  const authUser = useAppStore((state) => state.authUser);
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  if (!authUser || !roles.includes(authUser.role)) {
    return fallback ? <>{fallback}</> : <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

/**
 * RoleBasedGuard Component
 * Conditionally renders children based on user role
 * Useful for showing/hiding UI elements
 */
interface RoleBasedGuardProps {
  children: ReactNode;
  requiredRoles: User['role'] | User['role'][];
}

export const RoleBasedGuard = ({
  children,
  requiredRoles,
}: RoleBasedGuardProps) => {
  const authUser = useAppStore((state) => state.authUser);
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

  if (!authUser || !roles.includes(authUser.role)) {
    return null;
  }

  return <>{children}</>;
};

/**
 * useAuthGuard Hook
 * Provides role checking in component logic
 */
export const useAuthGuard = () => {
  const authUser = useAppStore((state) => state.authUser);
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  const hasRole = (requiredRoles: User['role'] | User['role'][]) => {
    if (!authUser) return false;
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(authUser.role);
  };

  const requireRole = (requiredRoles: User['role'] | User['role'][]) => {
    if (!hasRole(requiredRoles)) {
      throw new Error('Insufficient permissions');
    }
  };

  return {
    authUser,
    isAuthenticated,
    hasRole,
    requireRole,
  };
};
