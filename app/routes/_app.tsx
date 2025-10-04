import { Outlet } from 'react-router';
import { AppLayout } from '~/layouts/app-layout';

function App() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

export default App;
