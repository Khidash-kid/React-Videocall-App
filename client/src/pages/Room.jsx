import React, { useEffect, useCallback, useState, useRef } from "react";
import ReactPlayer from "react-player";
import peer from "../service/peer";
import "../styles/Room.css";
import { useSocket } from "../context/SocketProvider";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [remoteVideoVisible, setRemoteVideoVisible] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [facingMode, setFacingMode] = useState("user");

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const getStream = async (facing = "user") => {
    return await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { facingMode: facing },
    });
  };

  const handleCallUser = useCallback(async () => {
    const stream = await getStream(facingMode);
    setMyStream(stream);
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket, facingMode]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await getStream(facingMode);
      setMyStream(stream);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket, facingMode]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams[0];
      setRemoteStream(remoteStream);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  const toggleMute = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

   const toggleRemoteMute = () => {
    if (myStream) {
      myStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((prev) => !prev);
    }
  };

  const toggleVideo = () => {
    if (myStream) {
      myStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff((prev) => !prev);
    }
  };

  const toggleRemoteVideo = () => {
    setRemoteVideoVisible((prev) => !prev);
  };

  const togglePiP = async () => {
    const video = localVideoRef.current?.getInternalPlayer();
    if (video) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        video.requestPictureInPicture();
      }
    }
  };

  const toggleCamera = async () => {
    const newFacing = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacing);
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }
    const stream = await getStream(newFacing);
    setMyStream(stream);
    sendStreams();
  };

  const startRecording = () => {
    if (myStream) {
      const recorder = new MediaRecorder(myStream);
      setMediaRecorder(recorder);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) setRecordedChunks((prev) => [...prev, e.data]);
      };
      recorder.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
      URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  };

  const endCall = () => {
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
      setMyStream(null);
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
      setRemoteStream(null);
    }
    alert("Call Ended");
  };

  return (
    <div className="entire-video">
      <h1 className="heading">Room Page</h1>
      <h3 className="heading-p">{remoteSocketId ? "Connected" : "No one in room"}</h3>

      <div className="button-group">
        {myStream && <button className="stream-btn" onClick={sendStreams}>Send Stream</button>}
        {remoteSocketId && <button className="room-btn" onClick={handleCallUser}>CALL</button>}
      </div>
      <div className="video-center">
        <div className="video">
          {myStream && (
            <div className="v1">
              <h1>My Stream</h1>
              <ReactPlayer
                ref={localVideoRef}
                playing
                muted={false}
                url={myStream}
                width="400px"
                height="auto"
                className="react-player"
              />
            </div>
          )}
          {remoteStream && remoteVideoVisible && (
            <div className="v2">
              <h1>Remote Stream</h1>
              <ReactPlayer
                ref={remoteVideoRef}
                playing
                muted={false}
                url={remoteStream}
                width="400px"
                height=" auto"
                className="react-player"
              />
            </div>
          )}
        </div>
      </div>
      <div className="down-btn-grp">
        <button className="mute-btn db" onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"} 🔇
        </button>
        <button className="remote-mute-btn db" onClick={toggleRemoteMute}>
          {isMuted ? "Unmute" : "Mute"} 🔇
        </button>
        <button className="video-btn db" onClick={toggleVideo}>
          {isVideoOff ? "Start Video" : "Stop Video"}
        </button>
        <button className="remote-video-btn db" onClick={toggleRemoteVideo}>
          {remoteVideoVisible ? "Hide Remote Video" : "Show Remote Video"}
        </button>
        <button className="pip-btn db" onClick={togglePiP}>PiP</button>
        {/* <button className="camera-btn" onClick={toggleCamera}>Switch Camera</button> */}
        {!isRecording ? (
          <button className="record-btn db" onClick={startRecording}>Start Recording</button>
        ) : (
          <button className="record-btn db" onClick={stopRecording}>Stop & Download ⏹</button>
        )}
        <button className="end-btn db" onClick={endCall}>End Call </button>
      </div>
    </div>
  );
};

export default RoomPage;