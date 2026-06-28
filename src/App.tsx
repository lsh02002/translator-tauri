import { Route, Routes } from "react-router-dom";
import Login from "./components/pages/user/Login";
import RootPage from "./components/pages/root/RootPage";
import Signup from "./components/pages/user/Signup";
import { useEffect } from "react";
import { useLoginStore } from "./components/zustand/ZustandLogin";
import { BackwardButton } from "./components/form/BackwardButton";
import { BootstrapToastContainer } from "./components/form/Toast";
import SentenceCreatePage from "./components/pages/root/SetenceCreatePage";
import SentenceEditPage from "./components/pages/root/SentenceEditPage";

export default function App() {
  const { setIsLogin } = useLoginStore();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [setIsLogin]);

  return (
    <div className="mt-4">
      <BackwardButton />
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="/sentences/create" element={<SentenceCreatePage />} />
        <Route path="/sentences/:id/edit" element={<SentenceEditPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <BootstrapToastContainer />
    </div>
  );
}
