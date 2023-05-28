import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Conversations } from "./components/Conversations";
import { ActiveConversations } from "./components/ActiveConversations";
import { AuthContextProvider } from "./contexts/AuthContext";
import { NotificationContextProvider } from "./contexts/NotificationContext";
import { UserStatusContextProvider } from "./contexts/UserStatusContext";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthContextProvider>
              <NotificationContextProvider>
                <Navbar />
              </NotificationContextProvider>
            </AuthContextProvider>
          }
        >
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <NotificationContextProvider>
                  <UserStatusContextProvider>
                    <ActiveConversations />
                  </UserStatusContextProvider>
                </NotificationContextProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="chats/"
            element={
              <ProtectedRoute>
                <UserStatusContextProvider>
                  <Conversations />
                </UserStatusContextProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="chats/:conversationName"
            element={
              <ProtectedRoute>
                <UserStatusContextProvider>
                  <Chat />
                </UserStatusContextProvider>
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
