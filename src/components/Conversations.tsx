import { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext";
import useOutsideClick from "../hooks/useOutsideClick";

interface UserResponse {
  username: string;
  name: string;
  url: string;
}

export function Conversations({ closeModal }: any) {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef, () => closeModal(false));

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("http://127.0.0.1:8000/api/users/", {
        headers: {
          Authorization: `Token ${user?.token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    }
    fetchUsers();
  }, [user]);

  function createConversationName(username: string) {
    const namesAlph = [user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  return (
    <>
      <div
        className="relative z-10"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="max-w-md mx-auto my-4 mt-24">
            <div className="relative flex items-center w-full h-12 bg-gray-50 rounded-lg shadow overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                className="h-full w-full focus:ring-transparent 
            border-none text-sm text-gray-700 bg-gray-50 pr-2"
                type="text"
                id="search"
                value={search}
                placeholder="Search..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div ref={wrapperRef} className="max-w-md mx-auto my-4">
            <ul
              className="z-10 mt-1 max-h-96 w-full overflow-auto rounded-md 
              bg-white py-1 text-base shadow-lg ring-1 
              ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              {users
                .filter((u: any) => u.username.includes(search))
                .map((u: any) => (
                  <li
                    key={u.username}
                    className="text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-indigo-500 hover:text-white"
                  >
                    <Link
                      to={`/chats/${createConversationName(u.username)}`}
                      className="flex items-center"
                    >
                      <span className="font-normal ml-3 block truncate">
                        {u.username}
                        {u.username === user?.username && <span> (You)</span>}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
