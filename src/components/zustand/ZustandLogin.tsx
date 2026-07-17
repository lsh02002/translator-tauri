import { create } from "zustand";

type LoginState = {
  isLogin: boolean;
  categoryName: string;
};

type LoginStore = LoginState & {
  setIsLogin: (value: boolean | ((prev: boolean) => boolean)) => void;
  setCategoryName: (value: string | ((prev: string) => string)) => void;
};

export const useLoginStore = create<LoginStore>((set) => ({
  isLogin: false,
  categoryName: "",

  setIsLogin: (value) =>
    set((state) => ({
      isLogin: typeof value === "function" ? value(state.isLogin) : value,
    })),

  setCategoryName: (value) =>
    set((state) => ({
      categoryName: typeof value === "function" ? value(state.categoryName) : value,
    })),
}));
