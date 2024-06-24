import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("Created a new room ID");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("ROOM ID and username is Required");
      return;
    }

    //Redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <div className="homepage-logo-container">
          {/* <img className=" homePageLogo " src="./Web-icon.png" alt="" /> */}
          <h3>Welcome to Code Web</h3>
        </div>
        <h4 className="mainLabel">Paste invitation ROOM ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyUp={handleInputEnter}
          />
          <button className="joinBtn btn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            If you don't have an invite code then create &nbsp;
            <a href="" className="createNewBtn" onClick={createNewRoom}>
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          <a href="https://github.com/YashTirpude" target="blank">
            Github
          </a>{" "}
          <img src="./githublogo.png" alt="" />
        </h4>
        <h4>
          <a href="https://linkedin.com/in/yash-tirpude" target="blank">
            LinkedIn
          </a>{" "}
          <img className="linkedin-logo" src="./linkedinLogo.png" alt="" />
        </h4>
      </footer>
    </div>
  );
};

export default Home;
