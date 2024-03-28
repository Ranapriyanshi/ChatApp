import { io } from "socket.io-client";

const server = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:4000";

const socket = io(server, {
  transports: ["websocket"],
  upgrade: false,
});

export default socket;
