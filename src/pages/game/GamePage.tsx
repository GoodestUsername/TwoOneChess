import { useCallback, useContext, useEffect, useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// helper functions
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';

// types
import { Socket } from "socket.io-client";

// context
import { SocketContext } from "context/socketContext";
import TwoOneChessboard from "features/components/twoonechess/TwoOneChessboard";
import { useParams } from "react-router-dom";

const TOKEN_KEY = 'ACCESS_TOKEN';
const INVITE_LINK_URL = 'localhost:3000/';

const GamePage = () => {
  // Socket Context
  const socket = useContext<Socket>(SocketContext);
  const params = useParams();
  
  // Socket room info
  const [roomId, setRoomId] = useState<string>(params.roomId ? params.roomId : "");

  // Server Messages
  const [warningMessage, setWarningMessage] = useState("");
  const [serverMessage, setserverMessage] = useState("");

  // Socket functions
  const onConnect = useCallback(() => {
      const cookies = new Cookies();
      socket.emit("joinGame", {roomId: params.roomId, gameKey: null})
      socket.emit("register", cookies.get(TOKEN_KEY))
  }, [params.roomId, socket])

  const onSendRoomCode = useCallback((data: {roomId: string}) => {
      setRoomId(data.roomId);
  }, []);

  const onServerMessage = useCallback((data: {msg: string}) => {
      setserverMessage(data.msg);
  }, []);

  const onIssueWarning = useCallback((data: {msg: string}) => {
      setWarningMessage(data.msg);
  }, []);

  useEffect(() => {

  }, [])

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("sendRoomCode", onSendRoomCode);
    socket.on("issueWarning", onIssueWarning);
    socket.on("serverMessage", onServerMessage);
    
    return () => { 
      socket.removeAllListeners();

      socket.disconnect(); 
    };
  }, [socket, onConnect, onSendRoomCode, onIssueWarning, onServerMessage])

  return (
    <div className="App" style={{background: "#000000", color: "#d3d3d3"}}>
        <button onClick={ () => { socket.emit("createGame", uuidv4().slice(8)) } }>Create Invite Link</button>
        {roomId && <p>{INVITE_LINK_URL + roomId}</p>}
        <p>{warningMessage}</p>
        <p>{serverMessage}</p>
        <ToastContainer
          theme="colored"
          position="top-center"
          autoClose={false}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <TwoOneChessboard roomId={roomId}/>
    </div>
  );
}

export default GamePage;
