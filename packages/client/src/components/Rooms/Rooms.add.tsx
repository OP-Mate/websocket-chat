import React from "react";

interface IAddRoomProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const AddRoom: React.FC<IAddRoomProps> = ({ handleSubmit }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <p className="mb-4 text-lg font-semibold">Login</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition"
          >
            Join
          </button>
        </form>
      </div>
    </div>
  );
};
