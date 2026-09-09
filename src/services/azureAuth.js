import { PublicClientApplication } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
const apiScope = import.meta.env.VITE_AZURE_API_SCOPE;
const redirectUri = window.location.origin;

if (!clientId || !tenantId || !apiScope) {
  throw new Error('Faltan VITE_AZURE_CLIENT_ID, VITE_AZURE_TENANT_ID o VITE_AZURE_API_SCOPE.');
}

const msal = new PublicClientApplication({
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
});

const msalReady = msal.initialize();

export const prepareAzureAuth = async () => {
  await msalReady;
  const redirectResponse = await msal.handleRedirectPromise();
  const account = redirectResponse?.account ?? msal.getActiveAccount() ?? msal.getAllAccounts()[0];

  if (redirectResponse?.account) {
    msal.setActiveAccount(redirectResponse.account);
  }

  return obtenerSesion(account);
};

async function obtenerSesion(account) {
  if (!account) {
    return null;
  }

  const tokenResponse = await msal.acquireTokenSilent({
    account,
    scopes: [apiScope],
  });

  return {
    token: tokenResponse.accessToken,
    user: {
      name: account.name ?? account.username,
      email: account.username,
    },
  };
}

export const refreshToken = async () => {
  await msalReady;
  await msal.handleRedirectPromise();
  const account = msal.getActiveAccount() ?? msal.getAllAccounts()[0];
  return obtenerSesion(account);
};

export const loginWithAzure = async () => {
  await msalReady;
  await msal.loginRedirect({
    scopes: [apiScope],
    redirectUri,
  });
};

export const logoutFromAzure = async () => {
  await msalReady;
  await msal.logoutPopup({
    account: msal.getActiveAccount(),
    mainWindowRedirectUri: window.location.origin,
  });
};
