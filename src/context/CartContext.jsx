/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { USE_MOCK, serverCartService } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const STORAGE_KEY = 'summitlab.cart.v1';

/** Item del MS (productId) -> item local (id, conserva extras locales). */
const itemsToLocal = (remoteItems, prev = []) =>
  (remoteItems ?? []).map((item) => {
    const local = prev.find((p) => p.id === item.productId);
    return {
      id: item.productId,
      name: item.name ?? local?.name ?? '',
      price: item.price ?? local?.price ?? 0,
      quantity: item.quantity ?? 1,
      image: item.image ?? local?.image ?? '',
    };
  });

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const serverOn = !USE_MOCK && isAuthenticated;
  const syncedForSession = useRef(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // sin almacenamiento disponible
    }
  }, [items]);

  // Al autenticar: reemplazar el carrito del MS con el local y traerlo
  // de vuelta (una vez por sesión). Vaciar primero evita que las
  // cantidades se sumen en cada login. Sin sesión o en mock: 100% local.
  useEffect(() => {
    if (!serverOn || syncedForSession.current) return;
    syncedForSession.current = true;
    (async () => {
      try {
        const local = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
        await serverCartService.clear().catch(() => {});
        for (const item of local) {
          await serverCartService
            .addItem({
              productId: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })
            .catch(() => {});
        }
        const remote = await serverCartService.get().catch(() => null);
        if (remote) {
          setItems(itemsToLocal(remote.items, local));
        }
      } catch {
        // sin red: se sigue con el carrito local
      }
    })();
  }, [serverOn]);

  useEffect(() => {
    if (!isAuthenticated) syncedForSession.current = false;
  }, [isAuthenticated]);

  const addItem = useCallback(
    (product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prev, { ...product, quantity }];
      });
      if (serverOn) {
        serverCartService
          .addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image,
          })
          .catch(() => {});
      }
    },
    [serverOn]
  );

  const removeItem = useCallback(
    (id) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (serverOn) {
        serverCartService.removeItem(id).catch(() => {});
      }
    },
    [serverOn]
  );

  const updateQuantity = useCallback(
    (id, quantity) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
      if (serverOn) {
        serverCartService.setQuantity(id, quantity).catch(() => {});
      }
    },
    [removeItem, serverOn]
  );

  const clearCart = useCallback(() => {
    // Primero el servidor (con token aún válido), después lo local.
    if (serverOn) {
      serverCartService.clear().catch(() => {});
    }
    setItems([]);
  }, [serverOn]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totals = useMemo(
    () => ({
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    }),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      totals,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    }),
    [items, isOpen, totals, addItem, removeItem, updateQuantity, clearCart, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};
