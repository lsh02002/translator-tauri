import { Route, Routes } from "react-router-dom";
import Login from "./components/pages/user/Login";
import Signup from "./components/pages/user/Signup";
import { useEffect } from "react";
import { useLoginStore } from "./components/zustand/ZustandLogin";
import { BackwardButton } from "./components/form/button/BackwardButton";
import { BootstrapToastContainer } from "./components/form/toast/Toast";
import SentenceCreatePage from "./components/pages/create/SetenceCreatePage";
import SentenceEditPage from "./components/pages/edit/SentenceEditPage";
import SentenceListPage from "./components/pages/main/SentenceListPage";
import SentenceAllListPage from "./components/pages/list/SentenceAllListPage";

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
        <Route path="/" element={<SentenceListPage />} />
        <Route path="/sentences/list" element={<SentenceAllListPage />} />
        <Route path="/sentences/create" element={<SentenceCreatePage />} />
        <Route path="/sentences/:id/edit" element={<SentenceEditPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <BootstrapToastContainer />
    </div>
  );
}
