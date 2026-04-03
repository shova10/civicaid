import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import Staff from './pages/Staff'
import SubmitIssue from './pages/SubmitIssue'
import MyIssues from './pages/MyIssues'
import IssueDetail from './pages/IssueDetail'
import IssueMap from './pages/IssueMap'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminIssues from './pages/admin/AdminIssues'
import AdminMap from './pages/admin/AdminMap'

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          {/* Admin — dark sidebar layout */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/issues" element={<AdminIssues />} />
            <Route path="/admin/map" element={<AdminMap />} />
            <Route
              path="/admin/users"
              element={
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Users</h1>
                </div>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Analytics</h1>
                </div>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <div className="p-8">
                  <h1 className="text-2xl font-bold">Settings</h1>
                </div>
              }
            />
          </Route>

          {/* Citizen + Staff — top navbar layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/submit" element={<SubmitIssue />} />
            <Route path="/my-issues" element={<MyIssues />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
            <Route path="/map" element={<IssueMap />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
