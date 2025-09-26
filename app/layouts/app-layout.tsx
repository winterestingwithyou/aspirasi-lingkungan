import { Outlet } from "react-router";
import Footer from "~/components/footer";
import LoginModalProvider from "~/components/login-modal-provider";
import NavbarTop from "~/components/navbar-top";

export default function App() { 
  return (
    <LoginModalProvider>
      <NavbarTop />
      <main>
        <Outlet /> jir
      </main>
      <Footer />
    </LoginModalProvider>
  );
}
