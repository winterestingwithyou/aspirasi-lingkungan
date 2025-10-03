import { Outlet } from 'react-router';
import GovLayout from '~/pages/gov/gov-layout';

export default function Gov() {
  return (
    <GovLayout>
      <Outlet />
    </GovLayout>
  );
}
