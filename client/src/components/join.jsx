import React,{useState,useCallback,useEffect} from "react";
import "../styles/join.css";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketProvider";


export default function Join() {

    const [room, setRoomId] = useState("");
    const handleChange = (e) => {
        setRoomId(e.target.value);
    }
   const socket = useSocket();
  const navigate = useNavigate();

  // use this
  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      socket.emit("room:join", {  room });
    },
    [room, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const {  room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);


    return (
        <div className="join-container">
            <div className="container-body">
                <div className="head">
                    <h2>Join Meeting</h2>
                </div>
                <div className="form">
                    <form onSubmit={handleSubmitForm}>
                        <p>Meeting ID or Personal Link Name</p>
                        <input value={room} onChange={handleChange} type="text" placeholder="Enter Meeting ID or Personal Link Name" />
                        <button  type="submit">Join</button>
                    </form>
                </div>
        
            </div>
        </div>
    );
}



