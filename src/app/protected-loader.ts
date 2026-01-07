import { useSession } from '@/shared/model/session';
import { redirect } from 'react-router-dom';
import { ROUTES } from '@/shared/model/routes';
import { enableMocking } from '@/shared/api/mocks/enable-mocking';

export const protectedLoader = async () => {
  // включаем моки до того как запросим токен
  await enableMocking();
  const token = await useSession.getState().refreshToken();

  if (!token) {
    useSession.getState().logout();
    return redirect(ROUTES.LOGIN);
  }

  return null;
};
