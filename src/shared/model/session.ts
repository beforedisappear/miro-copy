import { createGStore } from 'create-gstore';
import { jwtDecode } from 'jwt-decode';

import { useMemo, useState } from 'react';
import { publicFetchClient } from '@/shared/api/instance';

export type Session = {
  userId: string;
  email: string;
  exp: number;
};

let refreshTokenPromise: Promise<string | null> | null = null;

export const useSession = createGStore(() => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const updateToken = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const removeToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const session = useMemo(
    () => (!token ? null : jwtDecode<Session>(token)),
    [token],
  );

  const refreshToken = async () => {
    if (!token) {
      return null;
    }

    const session = jwtDecode<Session>(token);

    if (session.exp < Date.now() / 1000 + 1) {
      if (!refreshTokenPromise) {
        refreshTokenPromise = publicFetchClient
          .POST('/auth/refresh')
          .then(r => r.data?.accessToken ?? null)
          .then(newToken => {
            if (newToken) {
              updateToken(newToken);
              return newToken;
            } else {
              removeToken();
              return null;
            }
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }

      const newToken = await refreshTokenPromise;

      return newToken;
    }

    return token;
  };

  return { session, refreshToken, logout: removeToken, login: updateToken };
});
