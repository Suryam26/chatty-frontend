import { useContext } from "react";

import { AuthContext } from "../contexts/AuthContext";
import { MessageModel } from "../models/Message";

interface MessageProps {
  message: MessageModel;
  deleteMessage: any;
}

export function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Message({ message, deleteMessage }: MessageProps) {
  const { user } = useContext(AuthContext);

  function formatMessageTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const options: any = { hour12: true, hour: "numeric", minute: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  return (
    <li
      className={classNames(
        "mt-1 mb-1 flex",
        user!.username !== message.from_user.username
          ? "justify-start"
          : "justify-end"
      )}
    >
      <div
        className={classNames(
          "relative max-w-xl rounded-lg px-2 py-1 text-gray-700 shadow",
          user!.username !== message.from_user.username ? "" : "bg-gray-100"
        )}
      >
        <div className="flex items-end">
          <span
            className={classNames(
              "block",
              message.is_deleted ? "italic text-sm" : ""
            )}
          >
            {message.content}
          </span>
          <span
            className="ml-2"
            style={{
              fontSize: "0.6rem",
              lineHeight: "1rem",
            }}
          >
            {formatMessageTimestamp(message.timestamp)}
          </span>
          {user!.username === message.from_user.username && (
            <span
              className="ml-1"
              style={{
                fontSize: "0.6rem",
                lineHeight: "1rem",
              }}
            >
              {message.read ? "seen" : "received"}
            </span>
          )}
        </div>
        {message.is_deleted ||
          (user!.username === message.from_user.username && (
            <div className="flex items-end">
              <button
                className="ml-auto"
                style={{
                  fontSize: "0.6rem",
                  lineHeight: "1rem",
                }}
                onClick={() => deleteMessage(message.id)}
              >
                delete
              </button>
            </div>
          ))}
      </div>
    </li>
  );
}
