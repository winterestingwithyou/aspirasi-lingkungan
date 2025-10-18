import { Navigate, Outlet } from 'react-router';
import GovLayout from '~/pages/gov/gov-layout';
import { useAuth } from '~/context/auth-context';

export default function Gov() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return (
    <GovLayout>
      <Outlet />
    </GovLayout>
  );
}
