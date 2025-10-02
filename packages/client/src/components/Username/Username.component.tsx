import React from "react";
import { useState } from "react";
import { Login, type IUsernameProps } from "./Username.login";
import { Register, type IRegisterProps } from "./Username.register";

type Tab = "login" | "register";

export const Username: React.FC<IUsernameProps & IRegisterProps> = ({
  handleLogin,
  handleRegister,
  error,
}) => {
  const [tab, setTab] = useState<Tab>("login");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center w-80">
        <div className="flex mb-4 w-full">
          <button
            className={`flex-1 py-2 rounded-tl-lg ${
              tab === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTab("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-tr-lg ${
              tab === "register"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setTab("register")}
            type="button"
          >
            Register
          </button>
        </div>
        {tab === "login" ? (
          <Login handleLogin={handleLogin} error={error} />
        ) : (
          <Register handleRegister={handleRegister} error={error} />
        )}
      </div>
    </div>
  );
};
