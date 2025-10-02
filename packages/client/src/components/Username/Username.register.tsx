export interface IRegisterProps {
  handleRegister: (e: React.FormEvent<HTMLFormElement>) => void;
  error?: string;
}

export const Register: React.FC<IRegisterProps> = ({
  handleRegister,
  error,
}) => (
  <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
    {error && (
      <div className="text-red-600 text-sm" role="alert">
        {error}
      </div>
    )}
    <input
      type="text"
      name="username"
      placeholder="Name"
      required
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      required
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      type="password"
      name="confirmPassword"
      placeholder="Confirm Password"
      required
      className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
    >
      Register
    </button>
  </form>
);
