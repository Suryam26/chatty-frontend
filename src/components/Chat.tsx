import { useState, useContext, useEffect, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Link, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHotkeys } from "react-hotkeys-hook";
import {
  ArrowSmallLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

import { MessageModel } from "../models/Message";
import { Message } from "./Message";
import { Status } from "./Status";
import { AuthContext } from "../contexts/AuthContext";
import { ChatLoader } from "./ChatLoader";
import { ConversationModel } from "../models/Conversation";
import { UserStatusContext } from "../contexts/UserStatusContext";

export function Chat() {
  const { user } = useContext(AuthContext);
  const { userStatusUpdate } = useContext(UserStatusContext);
  const { conversationName } = useParams();
  const [message, setMessage] = useState("");
  // eslint-disable-next-line
  const [name, setName] = useState(user?.username);
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const [page, setPage] = useState(2);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [typing, setTyping] = useState(false);
  const [conversation, setConversation] = useState<ConversationModel | null>(
    null
  );
  const [userStatus, setUserStatus] = useState<any>({});
  const [meTyping, setMeTyping] = useState(false);
  const timeout = useRef<any>();

  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://127.0.0.1:8000/chats/${conversationName}/` : null,
    {
      queryParams: {
        token: user ? user.token : "",
      },
      onOpen: () => {
        console.log("Connected!");
      },
      onClose: () => {
        console.log("Disconnected!");
      },
      // onMessage handler
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "chat_message_echo":
            sendJsonMessage({ type: "read_messages" });
            setMessageHistory((prev: any) => [data.message, ...prev]);
            break;
          case "last_50_messages":
            setMessageHistory(data.messages);
            setHasMoreMessages(data.has_more);
            break;
          case "typing":
            updateTyping(data);
            break;
          case "update_read_messages":
            if (messageHistory && data.sender === user?.username) {
              setMessageHistory((prev: any) =>
                prev.map((e: any) => {
                  e.read = true;
                  return e;
                })
              );
            }
            break;
          case "delete_message":
            if (messageHistory) {
              setMessageHistory((prev: any) =>
                prev.map((e: any) => {
                  if (e.id === data.message_id) {
                    e.is_deleted = true;
                    e.content = "This message has been deleted";
                  }
                  return e;
                })
              );
            }
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

  useEffect(() => {
    async function fetchConversation() {
      const apiRes = await fetch(
        `http://127.0.0.1:8000/api/conversations/${conversationName}/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${user?.token}`,
          },
        }
      );
      if (apiRes.status === 200) {
        const data: ConversationModel = await apiRes.json();
        setConversation(data);
        fetchUserStatus(data);
      }
    }
    fetchConversation();
  }, [conversationName, user]);

  async function fetchUserStatus(conversation: any) {
    const apiRes = await fetch(
      `http://127.0.0.1:8000/api/user_status/${conversation?.other_user.username}/`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${user?.token}`,
        },
      }
    );
    if (apiRes.status === 200) {
      const data: any = await apiRes.json();
      setUserStatus(data);
    }
  }

  useEffect(() => {
    if (
      userStatusUpdate &&
      conversation?.other_user.username === userStatusUpdate.user
    ) {
      setUserStatus(userStatusUpdate);
    }
  }, [userStatusUpdate]);

  async function fetchMessages() {
    const apiRes = await fetch(
      `http://127.0.0.1:8000/api/messages/?conversation=${conversationName}&page=${page}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${user?.token}`,
        },
      }
    );
    if (apiRes.status === 200) {
      const data: {
        count: number;
        next: string | null; // URL
        previous: string | null; // URL
        results: MessageModel[];
      } = await apiRes.json();
      setHasMoreMessages(data.next !== null);
      setPage(page + 1);
      setMessageHistory((prev: MessageModel[]) => prev.concat(data.results));
    }
  }

  const handleChangeMessage = (e: any) => {
    e.target.value.length === 0 ? timeoutFunction() : onType();
    setMessage(e.target.value);
  };

  const handleSubmit = () => {
    if (message.trim().length === 0) return;

    sendJsonMessage({
      type: "chat_message",
      message,
      name,
    });
    setMessage("");

    clearTimeout(timeout.current);
    timeoutFunction();
  };

  const inputReference: any = useHotkeys("enter", () => handleSubmit(), {
    enableOnFormTags: ["INPUT"],
  });

  useEffect(() => {
    (inputReference.current as HTMLElement).focus();
  }, [inputReference]);

  function timeoutFunction() {
    setMeTyping(false);
    sendJsonMessage({ type: "typing", typing: false });
  }

  function onType() {
    if (meTyping === false) {
      setMeTyping(true);
      sendJsonMessage({ type: "typing", typing: true });
      timeout.current = setTimeout(timeoutFunction, 5000);
    } else {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(timeoutFunction, 5000);
    }
  }

  useEffect(() => () => clearTimeout(timeout.current), []);

  function updateTyping(event: { user: string; typing: boolean }) {
    if (event.user !== user!.username) {
      setTyping(event.typing);
    }
  }

  useEffect(() => {
    if (connectionStatus === "Open") {
      sendJsonMessage({
        type: "read_messages",
      });
    }
  }, [connectionStatus, sendJsonMessage]);

  function deleteMessage(id: string) {
    sendJsonMessage({
      type: "delete_message",
      message_id: id,
    });
  }

  return (
    <>
      <div className="flex justify my-2 px-4">
        <Link to="/">
          <button
            type="button"
            className="
              shadow hover:shadow-lg focus:outline-none 
              font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            <div className="flex">
              <ArrowSmallLeftIcon
                className="h-4 w-4 mr-2 my-auto"
                aria-hidden="true"
              />
              <div className="leading-6">Home</div>
            </div>
          </button>
        </Link>
      </div>

      <div className="px-3">
        <ul className="mt-3 flex flex-col-reverse relative w-full border rounded-lg overflow-y-auto">
          <div className="flex w-full items-center justify-between bg-gray-100 rounded-b-lg p-3">
            <input
              type="text"
              className="block w-full rounded-full border-none shadow focus:ring-transparent p-3"
              name="message"
              value={message}
              onChange={handleChangeMessage}
              required
              ref={inputReference}
              maxLength={511}
            />
            <button
              className="ml-3 rounded-full shadow hover:shadow-lg bg-white p-3"
              onClick={handleSubmit}
            >
              <PaperAirplaneIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div
            id="scrollableDiv"
            className="h-[50vh] bg-gray-100 flex flex-col-reverse relative w-full overflow-y-auto p-6"
          >
            <div>
              {/* Put the scroll bar always on the bottom */}
              <InfiniteScroll
                dataLength={messageHistory.length}
                next={fetchMessages}
                className="flex flex-col-reverse" // To put endMessage and loader to the top
                inverse={true}
                hasMore={hasMoreMessages}
                loader={<ChatLoader />}
                scrollableTarget="scrollableDiv"
              >
                {messageHistory.map((message: MessageModel) => (
                  <Message
                    key={message.id}
                    message={message}
                    deleteMessage={deleteMessage}
                  />
                ))}
              </InfiniteScroll>
            </div>
          </div>

          {conversation && userStatus && (
            <div className="p-6 rounded-t-lg shadow">
              <h3 className="text-2xl text-gray-900">
                {conversation.other_user.username}
                <span className="text-sm ml-3 text-gray-500">
                  {typing ? (
                    <p className="inline italic truncate text-sm text-gray-500">typing...</p>
                  ) : userStatus.online ? (
                    "online"
                  ) : (
                    <Status status={userStatus} />
                  )}
                </span>
              </h3>
            </div>
          )}
        </ul>
      </div>
    </>
  );
}
