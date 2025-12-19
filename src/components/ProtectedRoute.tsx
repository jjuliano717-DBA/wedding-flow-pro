
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    const { user, isAuthenticated } = useAuth();

    // If not logged in, redirect to Auth
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    // If role restricted and user doesn't match
    if (allowedRoles && user && !allowedRoles.includes(user.role as UserRole)) {
        // Redirect to their appropriate dashboard based on their actual role
        if (user.role === 'business') return <Navigate to="/business" replace />;
        return <Navigate to="/planner" replace />;
    }

    // Admin bypass (assuming we might add an explicit admin role later, 
    // or treat specific users as admins. For now, we trust the allowedRoles)

    return <Outlet />;
}
