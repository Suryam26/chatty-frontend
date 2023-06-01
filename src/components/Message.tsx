import { useContext, useState } from "react";
import { CheckCircleIcon, TrashIcon } from "@heroicons/react/24/outline";

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
  const [showDel, setShowDel] = useState<boolean>(false);

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
      onClick={() => setShowDel(!showDel)}
    >
      <div className="relative max-w-xl rounded-lg px-2 py-1 shadow bg-white">
        <div className="flex items-end">
          <span
            className={classNames(
              "block",
              message.is_deleted ? "italic text-sm text-gray-500" : ""
            )}
          >
            {message.content}
          </span>
          <span
            className="ml-2 text-gray-500"
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
              {message.read ? (
                <CheckCircleIcon
                  className="h-5 w-5 text-blue-600"
                  aria-hidden="true"
                />
              ) : (
                <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
          )}
          {message.is_deleted ||
            (user!.username === message.from_user.username && showDel && (
              <button
                className="ml-auto"
                style={{
                  fontSize: "0.6rem",
                  lineHeight: "1rem",
                }}
                onClick={() => deleteMessage(message.id)}
              >
                <TrashIcon
                  className="h-5 w-5 text-red-500"
                  aria-hidden="true"
                />
              </button>
            ))}
        </div>
      </div>
    </li>
  );
}
