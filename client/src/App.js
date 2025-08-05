import { Routes, Route } from "react-router-dom";
// import "./App.css";
// import LobbyScreen from "./pages/Lobby.jsx";
import RoomPage from "./pages/Room.jsx";
import SignUp from './pages/SignUp.jsx'
import MainPage from "./pages/Main-Page";
import JoinPage from "./pages/join-page";
import HostPage from "./pages/host-page.jsx";
// import VideoCall from "./pages/videoCall";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<HostPage />} /> */}
        <Route path="/" element={<SignUp />} />
        <Route path="/Main-Page" element={<MainPage />} />
        <Route path="/join-page" element={<JoinPage />} />
        <Route path="/host-Page" element={<HostPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
}


export default App;
