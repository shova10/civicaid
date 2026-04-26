import { createContext, useReducer, useEffect } from 'react'

const initialState = {
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: false,
  isLoading: true,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    dispatch({ type: 'LOGIN', payload: { user, accessToken, refreshToken } })
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    dispatch({ type: 'LOGOUT' })
  }

  useEffect(() => {
    const raw = localStorage.getItem('user')
    if (raw === 'undefined' || raw === undefined) {
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    }

    const token = localStorage.getItem('accessToken')
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false })
      return
    }

    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (user) {
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
          accessToken: token,
          refreshToken: localStorage.getItem('refreshToken'),
        },
      })
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
