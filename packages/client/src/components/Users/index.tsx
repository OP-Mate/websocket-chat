import randomColor from "randomcolor";
import React from "react";
import { useUsers } from "../../store";

export const Users: React.FC = () => {
  const users = useUsers();

  return (
    <aside id="users">
      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ color: randomColor({ seed: user.name }) }}>
            {user.name}
          </li>
        ))}
      </ul>
    </aside>
  );
};
