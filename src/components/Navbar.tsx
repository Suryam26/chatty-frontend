import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";

import { AuthContext } from "../contexts/AuthContext";
import { NotificationContext } from "../contexts/NotificationContext";

export function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { unreadMessageCount } = useContext(NotificationContext);

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        <>
          <div className="mx-auto px-4 max-w-5xl">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 pl-2 items-center sm:items-stretch sm:justify-start">
                <Link to="/" className="flex items-center">
                  <div className="flex flex-shrink-0 items-center">
                    <img
                      className="block h-8 w-auto lg:hidden"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                    <img
                      className="hidden h-8 w-auto lg:block"
                      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                      alt="Your Company"
                    />
                  </div>
                </Link>
              </div>

              {/* Profile and notification */}
              <div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <div className="absolute rounded-full bg-gray-800 p-1 text-gray-400 right-24">
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                  {unreadMessageCount > 0 && (
                    <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1">
                      {unreadMessageCount}
                    </div>
                  )}
                </div>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex bg-gray-800 text-sm">
                      <span className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'">
                        Hi, {user?.username}
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2  origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        <button
                          onClick={logout}
                          className="block px-4 py-2 w-48 text-sm text-gray-700"
                        >
                          Sign out
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
        </>
      </Disclosure>

      <div className="max-w-5xl mx-auto py-6">
        <Outlet />
      </div>
    </>
  );
}
