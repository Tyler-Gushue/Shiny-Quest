import { createBrowserRouter, Navigate } from "react-router";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import HuntsPage from "./pages/HuntsPage";
import FriendsPage from "./pages/FriendsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.tsx"
import VerifyResetCodePage from "./pages/VerifyResetCodePage.tsx"
import ChangePasswordPage from "./pages/ChangePasswordPage.tsx"

export const router = createBrowserRouter([
  
    // Public routes
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/forgotPassword", element: <ForgotPasswordPage />},
    { path: "/forgotPassword/verify", element: <VerifyResetCodePage /> },
    { path: "/changePassword", element: <ChangePasswordPage /> },

    // Everything below requires login
    {
    element: <ProtectedRoute />,
    children: [
        {
        element: <AppLayout />,
        children: [
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: "dashboard", element: <DashboardPage /> },
            { path: "hunts", element: <HuntsPage /> },
            { path: "friends", element: <FriendsPage /> },
            { path: "profile/:username", element: <ProfilePage /> },
        ],
        },
    ],
    },

    { path: "*", element: <NotFoundPage /> },
]);