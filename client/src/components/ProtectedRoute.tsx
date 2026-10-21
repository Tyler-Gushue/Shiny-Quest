import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {

    const { user, isLoading } = useAuth();
    const location = useLocation();

    // PageLoader's overlay covers the screen while the session check runs
    if (isLoading) {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;

}