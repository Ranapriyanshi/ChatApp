import { create } from "zustand";
import { Room } from "./roomStore";
import { createJSONStorage, persist } from "zustand/middleware";

export type Message = {
  _id: string;
  content: string;
  sender: string;
  chat: string;
  seen: boolean;
  createdAt: string;
};

export type UnseenMessages = {
  messages: Array<Message>;
  room: Room | null;
};

type MessageStore = {
  unseenMessages: Array<UnseenMessages>;
};

type MessageAction = {
  setUnseenMessages: (message: Message | null, room: Room | null) => void;
  removeUnseenMessages: (room: Room | null) => void;
};

const useMessageStore = create(
  persist<MessageStore & MessageAction>(
    (set) => ({
      unseenMessages: [],
      setUnseenMessages: (message: Message | null, room: Room | null) => {
        set((state) => {
          if (message) {
            const roomIndex = state.unseenMessages.findIndex(
              (e) => e.room?._id == room?._id
            );
            if (roomIndex != -1) {
              if (
                state.unseenMessages[roomIndex].messages.findIndex(
                  (e) => e._id == message._id
                ) == -1
              )
                state.unseenMessages[roomIndex].messages.push(message);
              else return { ...state };
            } else {
              state.unseenMessages.push({ room, messages: [message] });
            }
          }

          return { ...state };
        });
      },
      removeUnseenMessages: (room: Room | null) => {
        set((state) => {
          const index = state.unseenMessages.findIndex(
            (e) => e.room?._id == room?._id
          );
          if (index != -1) {
            state.unseenMessages.splice(index, 1);
          }
          return { ...state };
        });
      },
    }),
    {
      name: "message",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useMessageStore;
