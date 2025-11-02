import randomColor from "randomcolor";
import { useUserId, useUsers } from "../../store";
import type { MessageSchemaType } from "chat-shared";
import { Avatar } from "../Avatar/Avatar.component";
import { formatDate } from "../../utils/dates";

interface WindowList {
  message: MessageSchemaType;
}

export const WindowList: React.FC<WindowList> = ({ message }) => {
  const userId = useUserId();
  const users = useUsers();

  const { sender_id, created_at, message: text } = message;

  const isUser = userId === sender_id;

  const user = users.find((user) => user.id === sender_id);
  const userName = user?.username || "";

  return (
    <li className="flex flex-col gap-3">
      <div className={`flex gap-3 ${isUser ? "justify-end" : ""}`}>
        {!isUser ? <Avatar id={sender_id} /> : null}
        <div>
          <span
            className="text-xs"
            style={{
              color: randomColor({
                seed: sender_id,
                luminosity: "dark",
              }),
            }}
          >
            {userName} @{formatDate(created_at)}
          </span>

          <p
            style={{
              borderColor: randomColor({
                seed: sender_id,
                luminosity: "dark",
              }),
            }}
            className="border p-2 rounded-md"
          >
            {text}
          </p>
        </div>
      </div>
    </li>
  );
};
