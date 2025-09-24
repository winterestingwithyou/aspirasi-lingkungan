import { Outlet } from "react-router";
import { useState } from "react";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";
import LoginModal from "~/components/login-modal";
import SuccessModal from "~/components/success-modal";

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  return (
    <>
      <Navbar onOpenLogin={() => setLoginOpen(true)} />
      <Outlet context={{ openSuccess: () => setSuccessOpen(true) }} />
      <Footer />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <SuccessModal open={successOpen} onClose={() => setSuccessOpen(false)} />
    </>
  );
}
