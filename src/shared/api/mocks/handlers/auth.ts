import type { ApiSchemas } from '../../schema';
import { http } from '../http';
import { HttpResponse } from 'msw';
import {
  createRefreshTokenCookie,
  generateTokens,
  verifyToken,
} from '../session';

const userPasswords = new Map<string, string>();

userPasswords.set('admin@gmail.com', '123456');

const mockUsers: ApiSchemas['User'][] = [{ id: '1', email: 'admin@gmail.com' }];

const mockTokens = new Map<string, string>();

export const authHandlers = [
  http.post('/auth/login', async ({ request }) => {
    const body = (await request.json()) as ApiSchemas['LoginRequest'];

    const user = mockUsers.find(u => u.email === body.email);
    const storedPassword = userPasswords.get(body.email);

    if (!user || !storedPassword || storedPassword !== body.password) {
      return HttpResponse.json(
        {
          message: 'Неверный email или пароль',
          code: 'INVALID_CREDENTIALS',
        },
        { status: 401 },
      );
    }

    const { accessToken, refreshToken } = await generateTokens({
      userId: user.id,
      email: user.email,
    });

    return HttpResponse.json(
      { accessToken, user },
      {
        status: 200,
        headers: { 'Set-Cookie': createRefreshTokenCookie(refreshToken) },
      },
    );
  }),

  http.post('/auth/register', async ({ request }) => {
    const body = (await request.json()) as ApiSchemas['RegisterRequest'];

    if (mockUsers.some(u => u.email === body.email)) {
      return HttpResponse.json(
        { message: 'Пользователь уже существует', code: 'USER_EXISTS' },
        { status: 400 },
      );
    }

    const newUser: ApiSchemas['User'] = {
      id: String(mockUsers.length + 1),
      email: body.email,
    };

    const { accessToken, refreshToken } = await generateTokens({
      userId: newUser.id,
      email: newUser.email,
    });

    mockUsers.push(newUser);
    userPasswords.set(body.email, body.password);
    mockTokens.set(body.email, refreshToken);

    return HttpResponse.json(
      {
        accessToken,
        user: newUser,
      },
      {
        status: 201,
        headers: { 'Set-Cookie': createRefreshTokenCookie(refreshToken) },
      },
    );
  }),

  http.post('/auth/refresh', async ({ cookies }) => {
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return HttpResponse.json(
        { message: 'Refresh token not found', code: 'REFRESH_TOKEN_NOT_FOUND' },
        { status: 401 },
      );
    }
    try {
      const session = await verifyToken(refreshToken);

      const user = mockUsers.find(u => u.id === session.userId);

      if (!user) {
        return HttpResponse.json(
          { message: 'User not found', code: 'USER_NOT_FOUND' },
          { status: 401 },
        );
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateTokens({ userId: user.id, email: user.email });

      return HttpResponse.json(
        { accessToken, user },
        {
          status: 200,
          headers: { 'Set-Cookie': createRefreshTokenCookie(newRefreshToken) },
        },
      );
    } catch (error) {
      console.error('Error refreshing token:', error);
      return HttpResponse.json(
        { message: 'Invalid refresh token', code: 'INVALID_REFRESH_TOKEN' },
        { status: 401 },
      );
    }
  }),
];
