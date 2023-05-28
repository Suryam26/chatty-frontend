import React, { createContext, ReactNode, useContext, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { AuthContext } from "./AuthContext";

const DefaultProps = {
  userStatusUpdate: {},
  connectionStatus: "Uninstantiated",
};

export interface UserStatusContextProps {
  userStatusUpdate: any;
  connectionStatus: string;
}

export const UserStatusContext =
  createContext<UserStatusContextProps>(DefaultProps);

export const UserStatusContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useContext(AuthContext);
  const [userStatusUpdate, setUserStatusUpdate] = useState<any>();

  const { readyState } = useWebSocket(
    user ? `ws://127.0.0.1:8000/status/` : null,
    {
      queryParams: {
        token: user ? user.token : "",
      },
      onOpen: () => {
        console.log("Connected to UserStatus!");
      },
      onClose: () => {
        console.log("Disconnected from UserStatus!");
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "user_status":
            setUserStatusUpdate(data.status);
            break;
          default:
            console.log("Unknown message type!");
            break;
        }
      },
    }
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <UserStatusContext.Provider
      value={{ userStatusUpdate, connectionStatus }}
    >
      {children}
    </UserStatusContext.Provider>
  );
};
