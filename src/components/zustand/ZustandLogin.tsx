import { create } from "zustand";

type LoginState = {
  isLogin: boolean;
};

type LoginStore = LoginState & {
  setIsLogin: (value: boolean | ((prev: boolean) => boolean)) => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
  isLogin: false,

  setIsLogin: (value) =>
    set((state) => ({
      isLogin: typeof value === "function" ? value(state.isLogin) : value,
    })),
}));
