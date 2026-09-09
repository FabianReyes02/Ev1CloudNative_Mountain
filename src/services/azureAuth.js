import { PublicClientApplication } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
const apiScope = import.meta.env.VITE_AZURE_API_SCOPE;

if (!clientId || !tenantId || !apiScope) {
  throw new Error('Faltan VITE_AZURE_CLIENT_ID, VITE_AZURE_TENANT_ID o VITE_AZURE_API_SCOPE.');
}

const msal = new PublicClientApplication({
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: `${window.location.origin}/auth-redirect.html`,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
});

const msalReady = msal.initialize();

export const loginWithAzure = async () => {
  await msalReady;
  const loginResponse = await msal.loginPopup({
    scopes: [apiScope],
  });
  msal.setActiveAccount(loginResponse.account);
  const tokenResponse = await msal.acquireTokenSilent({
    account: loginResponse.account,
    scopes: [apiScope],
  });

  return {
    token: tokenResponse.accessToken,
    user: {
      name: loginResponse.account.name ?? loginResponse.account.username,
      email: loginResponse.account.username,
    },
  };
};

export const logoutFromAzure = async () => {
  await msalReady;
  await msal.logoutPopup({
    account: msal.getActiveAccount(),
    mainWindowRedirectUri: window.location.origin,
  });
};
