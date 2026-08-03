import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { ProtectedRoute, GuestOnlyRoute } from "./components/ProtectedRoute.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { FeedPage } from "./pages/FeedPage.jsx";
import { PostDetailPage } from "./pages/PostDetailPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { EditProfilePage } from "./pages/EditProfilePage.jsx";
import { UsersPage } from "./pages/UsersPage.jsx";
import { FollowRequestsPage } from "./pages/FollowRequestsPage.jsx";
import { NotificationsPage } from "./pages/NotificationsPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route element={<GuestOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<FeedPage />} />
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route path="/profile/me/edit" element={<EditProfilePage />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/follow-requests" element={<FollowRequestsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
