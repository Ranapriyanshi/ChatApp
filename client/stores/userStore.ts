import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type User = {
  _id: string;
  f_name: string;
  l_name: string | null;
  username: string;
  email: string;
  pic: string;
}

type UserStore = {
  user: User | null;
}

type UserAction = {
  setUser: (user: User) => void;
}

const userStorage = createJSONStorage<UserStore & UserAction>(() => localStorage);

const useUserStore = create(
  persist<UserStore & UserAction>(
    (set) => ({
      user: null,
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'user',
      storage: userStorage,
    }
  )
);

export default useUserStore;