import { Route, Routes } from "react-router-dom";
import Login from "./components/pages/user/Login";
import RootPage from "./components/pages/root/RootPage";
import Signup from "./components/pages/user/Signup";
import { useEffect } from "react";
import { useLoginStore } from "./components/zustand/ZustandLogin";
import { BackwardButton } from "./components/form/BackwardButton";

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
    <>
      <BackwardButton />
      <Routes>
        <Route path="/" element={<RootPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}
