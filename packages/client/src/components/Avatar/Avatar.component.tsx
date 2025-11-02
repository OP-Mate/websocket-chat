interface AvatarProps {
  id: string;
  is_online?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ id, is_online = 1 }) => (
  <img
    className={`w-8 h-8 ${!is_online ? "grayscale" : ""}`}
    src={`https://avatar.iran.liara.run/public/boy?username=${id}`}
    alt=""
  />
);
