import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

// hooks
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// helper functions
import Cookies from 'universal-cookie';

// types
import { Socket } from "socket.io-client";

// context
import { SocketContext } from "context/socketContext";

// components
import TwoOneChess from "features/components/twoonechess/TwoOneChess";
import GameLinkModal from "features/components/twoonechess/GameLinkModal";

// styling
import 'react-toastify/dist/ReactToastify.css';

const TOKEN_KEY = 'ACCESS_TOKEN';
const INVITE_LINK_URL = 'localhost:3000/';

const GamePage = () => {
  // Socket Context
  const socket = useContext<Socket>(SocketContext);

  // params
  const params = useParams();
  
  // Socket room info
  const [roomId, setRoomId] = useState<string>(params.roomId ? params.roomId : "");

  // Modal toggle
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Socket functions
  const onConnect = useCallback(() => {
    const cookies = new Cookies();
    console.log("on connect")
    console.log(params)
    console.log(socket)
    socket.emit("register", cookies.get(TOKEN_KEY), (response: { status: boolean}) => {
      console.log("44 gamepage")
      console.log(response);
      if (params.roomId && !response.status) socket.emit("joinGame", {roomId: params.roomId, gameKey: null})
    })
  }, [params.roomId, socket])

  const onSendRoomCode = useCallback((data: {roomId: string, newGame: boolean}) => {
    console.log("51 gamepage")
    console.log(data);
    setRoomId(data.roomId);
    if (data.newGame)setIsModalOpen(true);
  }, []);

  const onServerMessage = useCallback((data: {msg: string}) => {
    console.log("58 gamepage")
    console.log(data);
    toast.info(data.msg, {autoClose: 5000});
  }, []);

  const onIssueWarning = useCallback((data: {msg: string}) => {
    console.log("64 gamepage")
    console.log(data);
    toast.warning(data.msg, {autoClose: 5000});
  }, []);

  const onStartGameGamePage = useCallback(() => {
    console.log("70 gamepage")
    console.log();
    setIsModalOpen(false);
  }, [])

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("sendRoomCode", onSendRoomCode);
    socket.on("issueWarning", onIssueWarning);
    socket.on("serverMessage", onServerMessage);
    socket.on("startGame", onStartGameGamePage)

    return () => { 
      socket.removeAllListeners();
      socket.disconnect(); 
    };
  }, [socket, onConnect, onSendRoomCode, onIssueWarning, onServerMessage, onStartGameGamePage])

  return (
    <>
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
      <GameLinkModal 
        isOpen={isModalOpen}
        inviteLink={INVITE_LINK_URL + roomId} 
        handleClose={() => setIsModalOpen(false)} />

      <TwoOneChess roomId={roomId}/>
  </>
  );
}

export default GamePage;
