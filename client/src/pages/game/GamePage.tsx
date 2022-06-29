import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';

// hooks
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// material ui
import { Box } from "@mui/material";

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
    socket.emit("register", cookies.get(TOKEN_KEY), (response: { status: boolean}) => {
      if (params.roomId && !response.status) socket.emit("joinGame", {roomId: params.roomId, gameKey: null})
    })
  }, [params.roomId, socket])

  const onSendRoomCode = useCallback((data: {roomId: string, newGame: boolean}) => {
    setRoomId(data.roomId);
    if (data.newGame)setIsModalOpen(true);
  }, []);

  const onServerMessage = useCallback((data: {msg: string}) => {
    toast.info(data.msg, {autoClose: 5000});
  }, []);

  const onIssueWarning = useCallback((data: {msg: string}) => {
    toast.warning(data.msg, {autoClose: 5000});
  }, []);

  const onStartGameGamePage = useCallback(() => {
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
    <Box sx={{marginTop: "20px", height: "calc(100% - 20px)"}} className="GamePage">
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
  </Box>
  );
}

export default GamePage;
