import type { UserSchemaType } from "chat-shared";
import { useState } from "react";
import { removePendingMessage, usePendingMessages } from "../../store";
import randomColor from "randomcolor";
import { Avatar } from "../Avatar/Avatar.component";

interface IUserList {
  user: UserSchemaType;
  handleJoinPrivateRoom: (userId: string) => Promise<void>;
}

export const UserList: React.FC<IUserList> = ({
  user,
  handleJoinPrivateRoom,
}) => {
  const pendingMessages = usePendingMessages();

  const [selectedUser, setSelectedUser] = useState("");

  const { id, username, isOnline } = user;

  const isUser = id === selectedUser;

  return (
    <li
      className={`relative border-b border-line last:border-transparent p-3 border-opacity-60 ${
        isUser
          ? "before:bottom-0 before:w-1 before:bg-line before:content-[''] before:left-0 before:rounded-lg before:absolute before:h-10 before:top-[10px]"
          : ""
      }`}
      key={id}
    >
      <button
        className="flex gap-3 items-center w-full relative"
        onClick={() => {
          handleJoinPrivateRoom(id);
          removePendingMessage(id);
          setSelectedUser(id);
        }}
      >
        <Avatar id={id} isOnline={isOnline} />
        <span
          style={{
            color: randomColor({ seed: id, luminosity: "dark" }),
          }}
          className={`text-lg font-medium flex-1 text-left ${
            !isOnline ? "opacity-50" : ""
          }`}
        >
          {username}
        </span>

        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-xs font-medium ${
              isOnline ? "text-green-600" : "text-red-500"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>

          {pendingMessages.includes(id) && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <span className="text-xs text-blue-600 font-medium">New</span>
            </div>
          )}
        </div>
      </button>
    </li>
  );
};
