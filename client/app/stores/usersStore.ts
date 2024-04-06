import { create } from "zustand";
import { User } from "./userStore";
import { createJSONStorage, persist } from "zustand/middleware";

type UsersStore = {
  users: Array<User>;
};

type UsersAction = {
  setUsers: (users: Array<User>) => void;
};

const useUsersStore = create(
  persist<UsersStore & UsersAction>((set) => ({
    users: [],
    setUsers: (users: Array<User>) => set({ users: users }),
  }), {
    name: "users",
    storage: createJSONStorage(() => localStorage)
  })
);

export default useUsersStore;
