interface AvatarProps {
  id: string;
  isOnline?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ id, isOnline = true }) => (
  <img
    className={`w-8 h-8 ${!isOnline ? "grayscale" : ""}`}
    src={`https://avatar.iran.liara.run/public/boy?username=${id}`}
    alt=""
  />
);
