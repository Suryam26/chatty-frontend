import React, { createContext, ReactNode, useContext, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { AuthContext } from "./AuthContext";

const DefaultProps = {
  unreadMessageCount: 0,
  unreadCountList: [],
  typing: {},
  connectionStatus: "Uninstantiated",
};

export interface UnreadCountListProps {
  from_user__username: string;
  count: number;
}

export interface NotificationProps {
  unreadMessageCount: number;
  unreadCountList: UnreadCountListProps[];
  typing: any;
  connectionStatus: string;
}

export const NotificationContext =
  createContext<NotificationProps>(DefaultProps);

export const NotificationContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useContext(AuthContext);
  const [typing, setTyping] = useState(false);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [unreadCountList, setUnreadCountList] = useState<
    UnreadCountListProps[]
  >([]);

  const { readyState } = useWebSocket(
    user ? `ws://127.0.0.1:8000/notifications/` : null,
    {
      queryParams: {
        token: user ? user.token : "",
      },
      onOpen: () => {
        console.log("Connected to Notifications!");
      },
      onClose: () => {
        console.log("Disconnected from Notifications!");
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "unread_count":
            setUnreadMessageCount(data.unread_count);
            setUnreadCountList(data.unread_count_list);
            break;
          case "new_message_notification":
            setUnreadMessageCount((count) => (count += 1));
            updateCountList(data.name);
            break;
          case "typing_notification":
            setTyping(data);
            break;
          default:
            console.log("Unknown message type!");
            break;
        }
      },
    }
  );

  function updateCountList(username: string) {
    const unreadCountListCopy =
      unreadCountList?.length > 0 ? [...unreadCountList] : [];
    const userIndex = unreadCountListCopy.findIndex(
      (e) => e.from_user__username === username
    );
    if (userIndex === -1) {
      unreadCountListCopy.push({ from_user__username: username, count: 1 });
    } else {
      unreadCountListCopy[userIndex].count++;
    }
    setUnreadCountList(unreadCountListCopy);
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <NotificationContext.Provider
      value={{ unreadMessageCount, unreadCountList, typing, connectionStatus }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
