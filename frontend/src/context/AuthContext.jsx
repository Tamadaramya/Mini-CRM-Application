import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/auth';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  token: authService.getToken(),
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Actions
const AUTH_ACTIONS = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAIL: 'AUTH_FAIL',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.AUTH_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.AUTH_FAIL:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check authentication on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();

      if (token) {
        try {
          dispatch({ type: AUTH_ACTIONS.AUTH_START });
          const response = await authService.getProfile();

          dispatch({
            type: AUTH_ACTIONS.AUTH_SUCCESS,
            payload: {
              user: response.user,
              token: token,
            },
          });
        } catch (error) {
          console.error('Auth check failed:', error);
          // Invalid token - clear it
          authService.removeToken();
          dispatch({ 
            type: AUTH_ACTIONS.AUTH_FAIL, 
            payload: null 
          });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });

      const response = await authService.login(credentials);

      // Store token
      authService.setToken(response.token);

      // Update state
      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: {
          user: response.user,
          token: response.token,
        },
      });

      toast.success(`Welcome back, ${response.user.name}!`);
      return response;

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAIL, 
        payload: message 
      });
      toast.error(message);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.AUTH_START });

      const response = await authService.register(userData);

      // Store token
      authService.setToken(response.token);

      // Update state
      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: {
          user: response.user,
          token: response.token,
        },
      });

      toast.success(`Welcome to CRM, ${response.user.name}!`);
      return response;

    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ 
        type: AUTH_ACTIONS.AUTH_FAIL, 
        payload: message 
      });
      toast.error(message);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.removeToken();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Logged out successfully');
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Update user profile
  const updateProfile = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.AUTH_SUCCESS,
      payload: {
        user: userData,
        token: state.token,
      },
    });
  };

  // Context value
  const contextValue = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,

    // Actions
    login,
    register,
    logout,
    clearError,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;