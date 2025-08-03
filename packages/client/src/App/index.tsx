import { createPortal } from "react-dom";
import "./App.css";
import { Message } from "../components/Message/Message.component";
import { Window } from "../components/Window/Window.component";
import { Users } from "../components/Users/Users.component";
import { Username } from "../components/Username/Username.component";

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
