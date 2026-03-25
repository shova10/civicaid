import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Admin from './pages/Admin'
import Register from './pages/Register'
import Staff from './pages/Staff'
import SubmitIssue from './pages/SubmitIssue'
import MyIssues from './pages/MyIssues'
import IssueDetail from './pages/IssueDetail'
import MapTest from './pages/MapTest'
// import axios from 'axios'

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/submit" element={<SubmitIssue />} />
            <Route path="/issues" element={<MyIssues />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
            <Route path="/map-test" element={<MapTest />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
