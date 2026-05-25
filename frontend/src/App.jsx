import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import ProtectedByRole from './components/ProtectedByRole'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import SubmitIssue from './pages/SubmitIssue'
import Issues from './pages/Issues'
import IssueDetail from './pages/IssueDetail'
import IssueMap from './pages/IssueMap'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminIssues from './pages/admin/AdminIssues'
import AdminMap from './pages/admin/AdminMap'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminUsers from './pages/admin/AdminUsers'
import AdminUserDetail from './pages/admin/AdminUserDetail'
import AdminProfile from './pages/admin/AdminProfile'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import VerifyOTP from './pages/VerifyOTP'
import Landing from './pages/Landing'

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          {/* Admin  */}
          <Route element={<ProtectedByRole roles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/issues" element={<AdminIssues />} />
              <Route path="/admin/map" element={<AdminMap />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/users/:id" element={<AdminUserDetail />} />
              <Route path="/admin/profile" element={<AdminProfile />} />
            </Route>
            <Route path="/admin/issues/:id" element={<IssueDetail />} />
          </Route>

          {/* Citizen  */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/submit" element={<SubmitIssue />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/map" element={<IssueMap />} />
          </Route>
          <Route path="/issues/:id" element={<IssueDetail />} />
        </Route>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
