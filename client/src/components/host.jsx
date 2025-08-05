import React,{useState,useCallback,useEffect} from "react";
import '../styles/host.css'; // Assuming you have a CSS file for styling
import { useNavigate } from 'react-router-dom';
// import { v4 as uuidV4 } from 'uuid';
import { useSocket } from "../context/SocketProvider";
import axios from "axios";


export default function Host() {
    //   const navigate = useNavigate();

    //    const createRoom = () => {
    //    const roomId = uuidV4();
    //    navigate(`/room/${roomId}`);
    
    
    const [room, setRoom] = useState("");

  const socket = useSocket();
  const navigate = useNavigate();

  // use this
  const handleSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
       socket.emit("room:join", { room });
    },
    [ room, socket]
  );

  // const handleDb = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("http://localhost:3000/host", { roomId: room });
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("Error saving to database:", error);
  //   }
  // }
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
 
    return(
    <div className="host-container">
        <div className="host-div">
            <div className="host-h1 center">
            <div className="host-h">
               <p>Your meeting has been launched in the Zoom Workplace app</p>
            </div>
            <div className="host-h2">
               <p>Don’t see your meeting?</p>
            </div>
            </div>
            <div className="host-p center">            
               <p>By joining a meeting, you agree to our <a href="https://www.zoom.com/en/trust/terms/">Terms of Service </a>and <a href="https://www.zoom.com/en/trust/privacy/privacy-statement/">Privacy Statement</a></p>
            </div>
            <div className="host-btn">
            <form onSubmit={handleSubmitForm} >
                 <input
                 className="room-input"
                   type="text"
                   id="room"
                   placeholder="Enter Room Number"
                   value={room}
                      onChange={(e) => setRoom(e.target.value)}
                   />
                 <br />
                <button type="submit">Launch Meeting</button>
            </form>
            </div>
        </div>
    </div>
    )
}