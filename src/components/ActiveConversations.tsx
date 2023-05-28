import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import { ConversationModel } from "../models/Conversation";
import { NotificationContext } from "../contexts/NotificationContext";

export function ActiveConversations() {
  const { user } = useContext(AuthContext);
  const { unreadCountList, typing } = useContext(NotificationContext);
  const [conversations, setActiveConversations] = useState<ConversationModel[]>(
    []
  );

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("http://127.0.0.1:8000/api/conversations/", {
        headers: {
          Authorization: `Token ${user?.token}`,
        },
      });
      const data = await res.json();
      setActiveConversations(data);
    }
    fetchUsers();
  }, [user, unreadCountList]);

  function createConversationName(username: string) {
    const namesAlph = [user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  function formatMessageTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const options: any = { hour12: true, hour: "numeric", minute: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  function getUnreadCount(username: string) {
    let userCount = unreadCountList.find(
      (e: any) => e.from_user__username === username
    );
    return userCount?.count;
  }

  function sortConversations(conversations: ConversationModel[]) {
    const sortedConversations = conversations.sort((a, b) => {
      const aTimestamp = a.last_message
        ? new Date(a.last_message.timestamp).getTime()
        : -1;
      const bTimestamp = b.last_message
        ? new Date(b.last_message.timestamp).getTime()
        : -1;
      return bTimestamp - aTimestamp;
    });
    return sortedConversations;
  }

  return (
    <div>
      {sortConversations(conversations).map(
        (c) =>
          c.last_message && (
            <Link
              to={`/chats/${createConversationName(c.other_user.username)}`}
              key={c.other_user.username}
            >
              <div className="border border-gray-200 w-full p-3">
                <div className="flex justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {c.other_user.username}
                    {c.other_user.username === user?.username && (
                      <span> (You)</span>
                    )}
                  </h3>
                  {getUnreadCount(c.other_user.username) && (
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-800">
                      <span className="text-xs text-center font-medium leading-none text-white">
                        {getUnreadCount(c.other_user.username)}
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex justify-between">
                  <p
                    className={`text-gray-700 ${
                      c.last_message.is_deleted ||
                      (typing.typing && typing.name === c.other_user.username)
                        ? "italic"
                        : ""
                    }`}
                  >
                    {typing.typing && typing.name === c.other_user.username
                      ? "typing..."
                      : c.last_message?.content}
                  </p>
                  <p className="text-gray-700">
                    {formatMessageTimestamp(c.last_message?.timestamp)}
                  </p>
                </div>
              </div>
            </Link>
          )
      )}
    </div>
  );
}
