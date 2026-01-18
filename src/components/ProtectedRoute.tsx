import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-xl font-semibold">Checking Authentication...</p>
                <p className="text-sm text-muted-foreground">If this takes too long, check your internet connection.</p>
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
