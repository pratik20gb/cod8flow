import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "../api/auth";

type AuthState = {
  session: AuthResponse | null;
  setSession: (session: AuthResponse) => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      signOut: () => set({ session: null })
    }),
    {
      name: "flowboard-auth"
    }
  )
);
