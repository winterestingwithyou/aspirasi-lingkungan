import type { PropsWithChildren } from 'react';
import Footer from '~/components/footer';
import LoginModalProvider from '~/components/login-modal-provider';
import NavbarTop from '~/components/navbar-top';

function AppLayout({ children }: PropsWithChildren) {
  return (
    <LoginModalProvider>
      <NavbarTop />
      <main>{children}</main>
      <Footer />
    </LoginModalProvider>
  );
}

export { AppLayout };
