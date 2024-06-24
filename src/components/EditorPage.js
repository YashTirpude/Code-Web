import React, { useContext, useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import { DataContext } from "./DataProvider";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { initSocket } from "../Socket";
import ACTIONS from "../Actions";
import { Navigate, useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const EditorPage = () => {
  const socketRef = useRef(null);

  const location = useLocation();
  const { roomId } = useParams();
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connection_error", (err) => handleErrors(err));
      socketRef.current.on("connection_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        toast.error("Socket connection failed,try again later");
        reactNavigator("/");
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
          }
          setClients(clients);
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  if (!location.state) {
    <Navigate to="/" />;
  }

  const { html, setHtml, css, setCss, js, setJs } = useContext(DataContext);

  const [src, setSrc] = useState("");

  const srcCode = `

  <html>
  <body>${html}</body>
  <style>${css}</style>
  <script>${js}</script>
 

  </html>
  `;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSrc(srcCode);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [html, css, js, srcCode]);

  const handle = useFullScreenHandle();

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("ROOM ID  copied to clipboard ");
    } catch (error) {
      toast.error("could not copy ROOM ID");
    }
  }

  function leaveRoom() {
    reactNavigator("/");
  }

  return (
    <div className="mainWrap">
      <div className="sidePanel">
        <div className="TopBar">
          <div className="logo">
            <img src="../Designer.png" alt="" className="logoImage" />
            <h3> Code Web</h3>
          </div>
          <h3>Connected</h3>

          <div className="clientsList">
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>

        <button className="btn copyBtn" onClick={copyRoomId}>
          COPY ROOM ID
        </button>
        <button className="btn leaveRoom" onClick={leaveRoom}>
          Leave
        </button>
      </div>

      <div className="editor-pane">
        <div className="editor ">
          <Editor
            value={html}
            onChange={setHtml}
            language="xml"
            icon="../html-5.png"
            title="HTML"
            background="#282a36"
            socketRef={socketRef}
            roomId={roomId}
          />
          <Editor
            value={css}
            onChange={setCss}
            language="css"
            icon="../css-3.png"
            title="CSS"
            background="#282a36"
            socketRef={socketRef}
            roomId={roomId}
          />
          <Editor
            value={js}
            onChange={setJs}
            language="javascript"
            icon="../js.png"
            title="JS"
            background="#282a36"
            socketRef={socketRef}
            roomId={roomId}
          />
        </div>
        <button className="fullscreen-btn" onClick={handle.enter}>
          Enter fullscreen
        </button>
        <FullScreen handle={handle}>
          <div
            className="result-output"
            style={{
              height: handle.active ? "100%" : "43vh",
            }}
          >
            <iframe
              srcDoc={src}
              title="Output"
              sandbox="allow-scripts"
              width="100%"
              height="100%"
              style={{ border: 0 }}
            ></iframe>
          </div>
        </FullScreen>
      </div>
    </div>
  );
};

export default EditorPage;
