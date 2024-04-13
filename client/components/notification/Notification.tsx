import useRoomStore from "@/app/stores/roomStore";
import socket from "@/socket";
import React from "react";

const Notification = () => {
  const { currentRoom } = useRoomStore();
  const [notifications, setNotifications] = React.useState<Array<string>>([]);

  socket.on("recieve_message", (data) => {
    if (data.chat != currentRoom?._id) {
      setNotifications([...notifications, data.content]);
    }
  });

  return <div>{notifications.map((e,i) => <div key={i}>{e}</div>)}</div>;
};

export default Notification;
