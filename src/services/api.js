import { mockProducts } from '../data/mockProducts';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const request = async (path, { method = 'GET', body, headers } = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error('api_UNAUTHORIZED');
  }

  if (!response.ok) {
    throw new Error(`api_error_${response.status}`);
  }

  return response.json();
};

export const productService = {
  list: async () => {
    if (USE_MOCK) {
      await delay(420);
      return mockProducts;
    }
    const data = await request('/products');
    return Array.isArray(data) ? data : data.products;
  },

  get: async (id) => {
    if (USE_MOCK) {
      await delay(240);
      return mockProducts.find((p) => p.id === Number(id)) ?? null;
    }
    return request(`/products/${id}`);
  },
};

export const cartService = {
  create: async (payload) => {
    if (USE_MOCK) {
      await delay(520);
      return { id: `PEDIDO-${String(Date.now()).slice(-6)}` };
    }
    return request('/orders', { method: 'POST', body: payload });
  },
};