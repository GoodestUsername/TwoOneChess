import { useEffect, useRef, useState } from "react";
import { Chess, Square, ShortMove } from 'chess.js';
import { Chessboard } from "react-chessboard";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

import { MoveAssignment, MoveWithAssignment, shortMoveToString, isPromoting } from "features/engine/chessEngine";
import PreviewConfirmButton from "features/components/twoonechess/previewConfirmButton";
import UciEngineWorker from "features/workers/stockfish";

const URL = 'http://localhost:3001';
// const URL = "";

const App = () => {
  const [game, setGame] = useState(new Chess());
  const [gameOn, setGameOn] = useState(false);
  const [playerColor, setPlayerColor] = useState(undefined);

  const [fBotMove, setFBotMove]  = useState<MoveWithAssignment>(null);
  const [sBotMove, setSBotMove] = useState<MoveWithAssignment>(null);
  const [tBotMove, setTBotMove]  = useState<MoveWithAssignment>(null);

  const [roomCode, setRoomCode] = useState<string>("");
  const [response, setResponse] = useState("");
  const [botMovePreviews, setBotMovePreviews] = useState<string[][]>([]);

  const stockfishRef = useRef<UciEngineWorker>();
  const socketRef = useRef<Socket>();

  useEffect(() => {
    stockfishRef.current = new UciEngineWorker("stockfish.js");  
    socketRef.current = io(URL, {
      transports: ['websocket'],
      forceNew: true
    });
    const {current: socket} = socketRef;

    socket.on("FromAPI", data => {
      setResponse(data);
    });

    socketRef.current?.on("sendRoomCode", data => {
      setRoomCode(data);
    });

    socketRef.current?.on("startGame", data => {
      setPlayerColor(data);
      console.log(data)
      setGameOn(true);
      setGame(new Chess());
    })

    socketRef.current?.on("opponentMove", data => {
      let proxyGame = new Chess(data.fen);
      proxyGame.move(data.moveData);
      setGame(proxyGame);
      let availableMoves = proxyGame.moves({verbose: true});
      
      // set stockfish internal history
      stockfishRef.current?.setMoveHistory(data.moveHistory)

      stockfishRef.current?.getMoves().then(({allMoves, bestMove}: any) => {
        // randomly select a move
        let randomMove: MoveWithAssignment = {
          move: availableMoves[Math.floor(Math.random() * availableMoves.length)],
          assignment: MoveAssignment.random
        };

        // get best move
        let calculatedBestMove: MoveWithAssignment = {move: bestMove, assignment: MoveAssignment.best};
        
        //pick a random calculated move
        let randomCalculatedMove: MoveWithAssignment = {move: allMoves[Math.floor(Math.random() * allMoves.length)].move, assignment: MoveAssignment.best};

        // set the calculated moves
        setFBotMove(calculatedBestMove);
        setSBotMove(randomCalculatedMove);
        setTBotMove(randomMove);
      }).catch((msg) => {
        console.log(msg)
      })
    });
    return () => { socket.disconnect(); };
  }, [])

  // functions that handle game state changes
  function safeGameMutate(modify: any) {
    setGame((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  // check if it is the clients turn
  function isPlayerTurn() {
    return (gameOn && playerColor && game.turn() === playerColor[0])
  }

  // handles sending move to game state with validation, and returns move if valid or false if not
  function handleMove(inputtedMove: ShortMove) {
    let move = null;
    let moveData: ShortMove = {
      from: inputtedMove.from,
      to: inputtedMove.to,
      promotion: undefined,
    }
    // check for promotion, and set to queen for simplicity
    if (isPromoting(game.fen(), moveData)) { moveData.promotion = "q" }

    // check if it is the clients turn
    if (!isPlayerTurn()) return null;

    // check if move is valid
    if (safeGameMutate((game: any) => { 
      move = game.move(moveData);
      return move;
      }) === null) return null; // illegal move, return null
    else {
      setFBotMove(null);
      setSBotMove(null);
      setTBotMove(null);
      return moveData;
    }
  }

  // calls handle move and emits move with socket, returns whether or not move is valid
  function handleMoveAndSend(inputtedMove: ShortMove) {
    let validMove = handleMove(inputtedMove)
    if (validMove) {
      socketRef.current?.emit("sendMove", {
        moveData: validMove,
        moveHistory: stockfishRef.current?.moveHistory + " " + shortMoveToString(validMove),
        roomId: roomCode,
        fen: game.fen()
      });
    }
    return validMove === null;
  }

  // function called on piece drop
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    return handleMoveAndSend({from: sourceSquare, to: targetSquare})
  }
  
  // handles room code changing
  function handleRoomCodeChange(event: { target: { value: string }}) {
      setRoomCode(event.target.value)
  }

  return (
    <div className="App">
      <div className="">
        <div className="">
          <div className="">
            <p>Current date: {response}</p>
            <button onClick={() => {socketRef.current?.emit("createGame", uuidv4())}}>Create Game</button>
            <p>Your room code: {roomCode}</p>
            <input type="text" placeholder="Enter Room Code" onChange={handleRoomCodeChange}></input>
            <button onClick={() => {socketRef.current?.emit("joinGame", roomCode)}}>join</button>

            <section>
              <PreviewConfirmButton
                botMove={fBotMove}
                handleMove={handleMoveAndSend}
                setBotMovePreviews={setBotMovePreviews}/>
              <PreviewConfirmButton
                botMove={sBotMove}
                handleMove={handleMoveAndSend}
                setBotMovePreviews={setBotMovePreviews}/>
              <PreviewConfirmButton
                botMove={tBotMove}
                handleMove={handleMoveAndSend}
                setBotMovePreviews={setBotMovePreviews}/>
            </section>
            <div
              style={{ 
                display: 'flex', 
                justifyContent: 'center '
              }}>
              <Chessboard
                // customBoardStyle={
                // }
                // customSquareStyles =    {{"e1": {fontWeight: "bold"}}}
                // customArrows={ [["", ""]]}
                customArrows           = { botMovePreviews }
                // customArrows={ [botMovePreviews]}
                boardOrientation       = { playerColor }
                customDropSquareStyle  = { {boxShadow: 'inset 0 0 1px 6px rgba(0,255,255,0.75)'} }
                customArrowColor       = { "rgb(255,170,0)" } 
                customDarkSquareStyle  = { { backgroundColor: '#B58863' } }
                customLightSquareStyle = { { backgroundColor: '#F0D9B5' } }
                position               = { game.fen()} onPieceDrop={onDrop }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
