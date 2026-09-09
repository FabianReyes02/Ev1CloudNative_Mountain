import { mockProducts } from '../data/mockProducts';
import { loginWithAzure, logoutFromAzure, refreshToken } from './azureAuth';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/+$/, '');

export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const doRequest = async (path, { method, body, headers, token }) => {
  return fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
};

const request = async (path, { method = 'GET', body, headers } = {}) => {
  let token = localStorage.getItem('summitlab_token');
  let response = await doRequest(path, { method, body, headers, token });

  if ((response.status === 401 || response.status === 403) && !USE_MOCK) {
    const fresh = await refreshToken().catch(() => null);
    if (fresh?.token) {
      token = fresh.token;
      localStorage.setItem('summitlab_token', token);
      localStorage.setItem(
        'summitlab_user',
        JSON.stringify(fresh.user)
      );
      response = await doRequest(path, { method, body, headers, token });
    }
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error('api_UNAUTHORIZED');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const error = new Error(errorBody?.error ?? `api_error_${response.status}`);
    error.status = response.status;
    throw error;
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

export const authService = {
  login: loginWithAzure,
  logout: logoutFromAzure,
};