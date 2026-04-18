import useAuth from '../hooks/useAuth'

const Home = () => {
  const { user, logout } = useAuth()

  return (
    <div className="bg-gray-50 flex justify-center p-8">
      <div className="max-w-xl bg-white rounded-2xl shadow-lg p-10">
        <div className="w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full text-lg font-bold mb-4">
          {user?.name?.charAt(0)}
        </div>
        {/* 👋 Welcome */}
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome, <span className="text-blue-600">{user?.name}</span>
        </h1>

        <p className="text-gray-500 mt-2">
          You are logged in as{' '}
          <span className="font-medium text-gray-700 capitalize">
            {user?.role}
          </span>
        </p>

        {/* 📊 Quick Info Card */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            Manage your issues, track progress, and contribute to improving your
            community.
          </p>
        </div>

        {/* 🚪 Logout */}
        <button
          onClick={logout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 transition text-white py-2 rounded-lg font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Home
