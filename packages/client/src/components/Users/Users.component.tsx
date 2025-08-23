import React from "react";
import { useUsers } from "../../store";
import randomColor from "randomcolor";

export const Users: React.FC = () => {
  const users = useUsers();

  return (
    <div className="flex flex-row border-2 p-3 border-line rounded-md overflow-hidden w-64">
      <ul className="flex flex-1 flex-col">
        {users.map((user) => (
          <li
            className="flex items-center gap-3 first:border-t border-b px-3 border-line py-3 border-opacity-60"
            key={user.id}
          >
            <img
              className="w-8 h-8"
              src={`https://avatar.iran.liara.run/public/boy?username=${user.id}`}
              alt={`${user.username} avatar`}
            />
            <span
              style={{
                color: randomColor({ seed: user.id, luminosity: "dark" }),
              }}
              className="text-lg font-medium"
            >
              {user.username}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
