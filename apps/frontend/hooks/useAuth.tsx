import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { gql } from 'graphql-request';
import gqlClient from '../client';
import type { User } from '@sapira/database';

type AuthStatus = 'FETCHING' | 'DONE' | 'REDIRECT';

type Auth = {
  user: User | null;
  status: AuthStatus;
  logout: () => void;
};

export const useAuth = (): Auth => {
  const router = useRouter();
  const [user, setUser] = useState<{ data: User | null; status: AuthStatus }>({
    data: null,
    status: 'FETCHING',
  });

  const logout = async () => {
    await gqlClient.request(gql`
      query {
        logout
      }
    `);
    setUser({
      data: null,
      status: 'REDIRECT',
    });
    router.push('/');
  };

  useEffect(() => {
    (async () => {
      const data = await gqlClient.request<{ checkRefreshToken: boolean }>(gql`
        query {
          checkRefreshToken
        }
      `);
      if (data.checkRefreshToken) {
        const query = gql`
          query {
            getProfile {
              id
              firstName
              middleName
              lastName
              email
              role
              status
              institution {
                id
                name
                email
                type
                educationalStage
                alias
              }
            }
          }
        `;
        try {
          const user = await gqlClient.request<{ getProfile: User }>(query);
          setUser({
            data: user.getProfile,
            status: 'DONE',
          });
        } catch {
          await gqlClient.request(gql`
            query {
              token {
                accessToken
              }
            }
          `);
          const user = await gqlClient.request<{ getProfile: User }>(query);
          setUser({
            data: user.getProfile,
            status: 'DONE',
          });
        }
      } else {
        setUser({
          data: null,
          status: 'REDIRECT',
        });
      }
    })();
  }, []);

  return { user: user.data, status: user.status, logout };
};
