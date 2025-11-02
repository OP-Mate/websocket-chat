import React from "react";
import { useUserId, useUsername, useUsers } from "../../store";
import randomColor from "randomcolor";
import { UserList } from "./UserList";
import { Avatar } from "../Avatar/Avatar.component";

interface IUsersProps {
  handleJoinPrivateRoom: (userId: string) => Promise<void>;
}

export const Users: React.FC<IUsersProps> = ({ handleJoinPrivateRoom }) => {
  const users = useUsers();
  const userId = useUserId();
  const username = useUsername();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row border-2 py-3 px-5 border-line rounded-md overflow-hidden w-64">
        <div className="flex gap-3 items-center w-full">
          <Avatar id={userId} />
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
          {users.map((user) => (
            <UserList
              key={user.id}
              user={user}
              handleJoinPrivateRoom={handleJoinPrivateRoom}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
