/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  authService,
  clearStoredSession,
  getStoredSession,
  verifyStoredToken,
} from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => getStoredSession());
  const [status, setStatus] = useState(() => verifyStoredToken());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const refreshStatus = useCallback(() => {
    setSession(getStoredSession());
    setStatus(verifyStoredToken());
  }, []);

  useEffect(() => {
    const onStorage = (event) => {
      if (!event.key || event.key.endsWith('summitlab.auth.v1')) {
        refreshStatus();
      }
    };
    window.addEventListener('storage', onStorage);
    const timer = window.setInterval(refreshStatus, 30000);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.clearInterval(timer);
    };
  }, [refreshStatus]);

  const openAuthModal = useCallback((mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => setAuthModalOpen(false), []);

  const login = useCallback(
    async (credentials) => {
      const next = await authService.login(credentials);
      refreshStatus();
      setAuthModalOpen(false);
      return next;
    },
    [refreshStatus],
  );

  const register = useCallback(
    async (payload) => {
      const next = await authService.register(payload);
      refreshStatus();
      setAuthModalOpen(false);
      return next;
    },
    [refreshStatus],
  );

  const logout = useCallback(() => {
    clearStoredSession();
    refreshStatus();
  }, [refreshStatus]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: status.valid,
      tokenStatus: status,
      authModalOpen,
      authModalMode,
      setAuthModalMode,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
      refreshStatus,
    }),
    [
      session,
      status,
      authModalOpen,
      authModalMode,
      openAuthModal,
      closeAuthModal,
      login,
      register,
      logout,
      refreshStatus,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
