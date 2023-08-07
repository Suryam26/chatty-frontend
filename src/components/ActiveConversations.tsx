import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Conversations } from "./Conversations";
import { AuthContext } from "../contexts/AuthContext";
import { ConversationModel } from "../models/Conversation";
import { NotificationContext } from "../contexts/NotificationContext";
import { PlusSmallIcon } from "@heroicons/react/24/outline";

export function ActiveConversations() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { unreadCountList, typing } = useContext(NotificationContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [conversations, setActiveConversations] = useState<ConversationModel[]>(
    []
  );

  useEffect(() => {
    async function fetchUsers() {
      fetch("http://127.0.0.1:8000/api/conversations/", {
        headers: {
          Authorization: `Token ${user?.token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setActiveConversations(data);
        })
        .catch((error) => {
          console.log(error);
          navigate("/login");
        });
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
    <>
      {isModalOpen && (
        <Conversations closeModal={() => setIsModalOpen(false)} />
      )}

      <div className="flex justify-end my-4 px-4">
        <button
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 
              shadow hover:shadow-lg focus:outline-none 
              font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="flex">
            <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
            <div className="leading-6">New Chat</div>
          </div>
        </button>
      </div>

      <ul role="list" className="divide-y divide-gray-100 px-4">
        {sortConversations(conversations).map(
          (person) =>
            person.last_message && (
              <li key={person.other_user.username}>
                <Link
                  className="flex justify-between rounded-lg gap-x-6 py-5 px-5 hover:bg-gray-100"
                  to={`/chats/${createConversationName(
                    person.other_user.username
                  )}`}
                >
                  <div className="flex gap-x-4">
                    <div className="min-w-0 flex-auto">
                      <p className="font-semibold leading-6 text-gray-900">
                        {person.other_user.username}{" "}
                        {person.other_user.username === user?.username && (
                          <span> (You)</span>
                        )}
                      </p>
                      <p
                        className={`mt-1 truncate text-sm leading-5  ${
                          person.last_message.is_deleted ||
                          (typing.typing &&
                            typing.name === person.other_user.username)
                            ? "italic text-gray-500"
                            : "text-gray-700"
                        }`}
                      >
                        {typing.typing &&
                        typing.name === person.other_user.username
                          ? "typing..."
                          : person.last_message?.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-sm h-6 leading-6 text-gray-900">
                      {getUnreadCount(person.other_user.username) && (
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-800">
                          <span className="text-xs text-center font-medium leading-none text-white">
                            {getUnreadCount(person.other_user.username)}
                          </span>
                        </span>
                      )}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      {formatMessageTimestamp(person.last_message?.timestamp)}
                    </p>
                  </div>
                </Link>
              </li>
            )
        )}
      </ul>
    </>
  );
}
