import { Chessboard } from "react-chessboard";
import { useEffect, useRef, useState } from "react";
import { Chess } from 'chess.js';
import { io, Socket } from "socket.io-client";
// const URL = 'http://localhost:3001';
const URL = "";


const App = () => {
  const [game, setGame] = useState(new Chess());
  const [roomCode, setRoomCode] = useState<string>("");
  const [response, setResponse] = useState("");
  const [gameOn, setGameOn] = useState(false);
  const socketRef = useRef<Socket>();
  var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));

  var stockfish = new Worker('stockfish.js');
  stockfish.addEventListener('message', function (e) {
    console.log(e.data);
  });

  stockfish.postMessage('uci');
  useEffect(() => {
    socketRef.current = io(URL, {
      transports: ['websocket'],
      forceNew: true
    });
    const {current: socket} = socketRef;

    socket.on("FromAPI", data => {
      setResponse(data);
    });

    socketRef.current?.on("createRoom", data => {
      setRoomCode(data);
    });

    socketRef.current?.on("startGame", data => {
      setGameOn(true);
      setGame(new Chess())
    })

    return () => { socket.disconnect(); };
  }, []);

  useEffect(()=>{
    socketRef.current?.on("opponentMove", data => {
      safeGameMutate((game: any) => {
        game.move(data);
      });
      console.log("received move", data)
    });
  }, [game, gameOn])

  function safeGameMutate(modify: any) {
    setGame((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function onDrop(sourceSquare: any, targetSquare: any) {
    console.log("will move")
    let move = null;
    let moveData = {
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    }
    if (gameOn) {
      safeGameMutate((game: any) => {
        move = game.move(moveData);
      });
    }

    if (move === null) return false; // illegal move
    else {
      socketRef.current?.emit("sendMove", {
        move: moveData,
        roomId: roomCode,
      });
      return true;
    }
  }
  const handleRoomCodeChange = (event: { target: { value: string }}) => {
      setRoomCode(event.target.value)
  }

  return (
    <div className="App">
      <p>Current date: {response}</p>
      <button onClick={() => {socketRef.current?.emit("createGame", roomCode)}}>Create Game</button>
      <p>Your room code: {roomCode}</p>
      <input type="text" placeholder="Enter Room Code" onChange={handleRoomCodeChange}></input>
      <button onClick={() => {socketRef.current?.emit("joinGame", roomCode)}}>join</button>
       <Chessboard position={game.fen()} onPieceDrop={onDrop}/>
    </div>
  );
}

export default App;
