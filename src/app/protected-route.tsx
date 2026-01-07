import { ROUTES } from '@/shared/model/routes';
import { Outlet } from 'react-router-dom';
import { useSession } from '@/shared/model/session';
import { Navigate } from 'react-router-dom';

export function ProtectedRoute() {
  const { session } = useSession();

  if (!session) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return <Outlet />;
}
