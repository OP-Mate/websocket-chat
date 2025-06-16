import { createPortal } from "react-dom";
import "./App.css";
import { Message } from "../components/Message";
import { Window } from "../components/Window";
import { Users } from "../components/Users";
import { Username } from "../components/Username";

import { useName } from "../store";

export function App() {
  const name = useName();

  return (
    <>
      {!name && createPortal(<Username />, document.getElementById("portal")!)}
      <div id="container">
        <Users />
        <div id="message">
          <Window />
          <Message />
        </div>
      </div>
    </>
  );
}
