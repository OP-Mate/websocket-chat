import React, { useState } from "react";
import {
  removePendingMessage,
  usePendingMessages,
  useUserId,
  useUsername,
  useUsers,
} from "../../store";
import randomColor from "randomcolor";

interface IUsersProps {
  handleJoinPrivateRoom: (userId: string) => Promise<void>;
}

export const Users: React.FC<IUsersProps> = ({ handleJoinPrivateRoom }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const users = useUsers();
  const userId = useUserId();
  const username = useUsername();
  const pendingMessages = usePendingMessages();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row border-2 py-3 px-5 border-line rounded-md overflow-hidden w-64">
        <div className="flex gap-3 items-center w-full">
          <img
            className="w-8 h-8"
            src={`https://avatar.iran.liara.run/public/boy?username=${userId}`}
            alt={`${username} avatar`}
          />
          <span
            style={{
              color: randomColor({ seed: userId, luminosity: "dark" }),
            }}
            className="text-lg font-medium flex-1 text-left"
          >
            {username}
          </span>
          <span className="text-xs font-medium text-green-600">Online</span>
        </div>
      </div>
      <div className="flex flex-row border-2 px-3 border-line rounded-md overflow-hidden w-64">
        <ul className="flex flex-1 flex-col">
          {users.map((user) => {
            return (
              <li
                className={`relative border-b border-line last:border-transparent p-3 border-opacity-60 ${
                  user.id === selectedUser
                    ? "before:bottom-0 before:w-1 before:bg-line before:content-[''] before:left-0 before:rounded-lg before:absolute before:h-10 before:top-[10px]"
                    : ""
                }`}
                key={user.id}
              >
                <button
                  className="flex gap-3 items-center w-full relative"
                  onClick={() => {
                    handleJoinPrivateRoom(user.id);
                    removePendingMessage(user.id);
                    setSelectedUser(user.id);
                  }}
                >
                  <img
                    className={`w-8 h-8 ${!user.is_online ? "grayscale" : ""}`}
                    src={`https://avatar.iran.liara.run/public/boy?username=${user.id}`}
                    alt={`${user.username} avatar`}
                  />

                  <span
                    style={{
                      color: randomColor({ seed: user.id, luminosity: "dark" }),
                    }}
                    className={`text-lg font-medium flex-1 text-left ${
                      !user.is_online ? "opacity-50" : ""
                    }`}
                  >
                    {user.username}
                  </span>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-xs font-medium ${
                        user.is_online ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {user.is_online ? "Online" : "Offline"}
                    </span>

                    {pendingMessages.includes(user.id) && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <span className="text-xs text-blue-600 font-medium">
                          New
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
