export const NoChannel = () => {
  return (
    <div className="flex flex-col gap-2 border-2 border-line rounded-md flex-1 p-3 overflow-y-scroll">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Channel Selected
        </h3>

        <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
          Choose a user from the sidebar to start a private conversation or
          select a room to join the discussion.
        </p>

        <div className="mt-6 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-600 text-xs font-medium">
            💡 Tip: Click on any user to start chatting
          </p>
        </div>
      </div>
    </div>
  );
};
