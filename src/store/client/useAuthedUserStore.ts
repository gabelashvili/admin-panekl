import { create } from "zustand";
import { AuthedUserQueryResponse } from "../server/features/auth/interfaces";

interface AuthedUserStore {
    user: AuthedUserQueryResponse | null;
    setAuthedUser: (authedUser: AuthedUserStore['user']) => void
}

const useAuthedUserStore = create<AuthedUserStore>((set) => ({
    user: null,
    setAuthedUser: (authedUser: AuthedUserStore['user']) => set(() => ({ user: authedUser })),
  }));
  
  export default useAuthedUserStore;