import { create } from "zustand";
import { User } from "./userStore";

export type Room = {
  _id: string;
  messages: Array<string>;
  users: Array<string>;
  room: string;
};

type RoomStore = {
  rooms: Array<Room>;
  currentRoom: Room | null;
  users: Array<User>;
};

type RoomAction = {
  setCurrentRoom: (room: Room | null) => void;
  setRooms: (rooms: Array<Room>) => void;
  setUsers: (users: Array<User>) => void;
}

const useRoomStore = create<RoomStore & RoomAction>()((set) => ({
  rooms: [],
  currentRoom: null,
  users: [],
  setCurrentRoom: (room: Room | null) => set({ currentRoom: room }),
  setRooms: (rooms: Array<Room>) => set({ rooms: rooms }),
  setUsers: (users: Array<User>) => set({ users: users }),
}));

export default useRoomStore;
