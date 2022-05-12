import { Chessboard } from "react-chessboard";
import { useEffect, useRef, useState } from "react";
import { Chess, Square } from 'chess.js';
import { io, Socket } from "socket.io-client";
import { ShortMove } from "chess.js";
import UciEngineWorker from "features/workers/stockfish";
import { shortMoveToString } from "features/engine/chessEngine";
import { v4 as uuidv4 } from 'uuid';
import ConfirmButton from "features/components/confirmationButton";
const URL = 'http://localhost:3001';
// const URL = "";

type MoveWithAssignment = {
  move: ShortMove,
  assignment: MoveAssignment
} | null;

class MoveAssignment {
  // Create new instances of the same class as static attributes
  static best = new MoveAssignment("best")
  static middle = new MoveAssignment("middle")
  static random = new MoveAssignment("random")
  name: string;

  constructor(name: string) {
    this.name = name
  }
}

const App = () => {
  const [game, setGame] = useState(new Chess());
  const [roomCode, setRoomCode] = useState<string>("");
  const [response, setResponse] = useState("");
  const [gameOn, setGameOn] = useState(false);
  const [firstCalculatedMove,  setFirstCalculatedMove]  = useState<MoveWithAssignment>(null);
  const [secondCalculatedMove, setSecondCalculatedMove] = useState<MoveWithAssignment>(null);
  const [thirdCalculatedMove,  setThirdCalculatedMove]  = useState<MoveWithAssignment>(null);
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

    socketRef.current?.on("createRoom", data => {
      setRoomCode(data);
    });

    socketRef.current?.on("startGame", data => {
      setGameOn(true);
      setGame(new Chess());
    })

    return () => { socket.disconnect(); };
  }, [])

  useEffect(()=>{
    socketRef.current?.on("opponentMove", data => {
      let proxyGame = new Chess(data.fen);
      proxyGame.move(data.moveData);
      setGame(proxyGame);
      let availableMoves = proxyGame.moves({verbose: true});
      stockfishRef.current?.setMoveHistory(data.moveHistory)
      stockfishRef.current?.getMoves().then(({allMoves, bestMove}: any) => {
        let randomlySelectedMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        let calculatedBestMove: MoveWithAssignment = {move: bestMove, assignment: MoveAssignment.best};
        let randomCalculatedMove: MoveWithAssignment = {move: allMoves[Math.floor(Math.random() * allMoves.length)].move, assignment: MoveAssignment.best};
        let randomMove: MoveWithAssignment = {
          move: randomlySelectedMove,
          assignment: MoveAssignment.random
        };
        setFirstCalculatedMove(calculatedBestMove);
        setSecondCalculatedMove(randomCalculatedMove);
        setThirdCalculatedMove(randomMove);
      }).catch((msg) => {
        console.log(msg)
      })
    });
  }, [])

  function safeGameMutate(modify: any) {
    setGame((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function isPromoting(fen: string, move: ShortMove): boolean {
    // @author: varunpvp
    // @from  : https://github.com/jhlywa/chess.js/issues/131
    const chess = new Chess(fen);
  
    const piece = chess.get(move.from);
  
    if (piece?.type !== "p") {
      return false;
    }
  
    if (piece.color !== chess.turn()) {
      return false;
    }
  
    if (!["1", "8"].some((it) => move.to.endsWith(it))) {
      return false;
    }
  
    return chess
      .moves({ square: move.from, verbose: true })
      .map((it) => it.to)
      .includes(move.to);
  }

  function onDrop(sourceSquare: Square, targetSquare: Square) {
    return handleMove({from: sourceSquare, to: targetSquare})
  }

  function handleMove(inputtedMove: ShortMove) {
    if (gameOn) {
      let move = null;
      let moveData: ShortMove = {
        from: inputtedMove.from,
        to: inputtedMove.to,
        promotion: undefined,
      }
      // check for promotion, and set to queen for simplicity
      if (isPromoting(game.fen(), moveData)) { moveData.promotion = "q" }

      // check if move is valid
      if (safeGameMutate((game: any) => { 
        move = game.move(moveData);
        return move;
      }) === null) return false; // illegal move, return false
      else {
        console.log("sending move")
        socketRef.current?.emit("sendMove", {
          moveData: moveData,
          moveHistory: stockfishRef.current?.moveHistory + " " + shortMoveToString(moveData),
          roomId: roomCode,
          fen: game.fen()
        });
        return true;
      }
    }
    return false;
  }

  const handleRoomCodeChange = (event: { target: { value: string }}) => {
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
              <ConfirmButton
                defaultText     ={ "Calculating" }
                buttonText      ={ shortMoveToString(firstCalculatedMove?.move) }
                onClickEvent    ={ () => {if (firstCalculatedMove?.move) handleMove(firstCalculatedMove?.move)} }/>
              <ConfirmButton
                defaultText     ={ "Calculating" }
                buttonText      ={ shortMoveToString(secondCalculatedMove?.move) }
                onClickEvent    ={ () => {if (secondCalculatedMove?.move) handleMove(secondCalculatedMove?.move)} }/>
              <ConfirmButton
                defaultText     ={ "Calculating" }
                buttonText      ={ shortMoveToString(thirdCalculatedMove?.move) }
                onClickEvent    ={ () => {if (thirdCalculatedMove?.move) handleMove(thirdCalculatedMove?.move)} }/>
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
                // customArrows={ [ ['a3', 'a5'], ['g1', 'f3'] ]}
                customDropSquareStyle = {{boxShadow: 'inset 0 0 1px 6px rgba(0,255,255,0.75)'}}
                customArrowColor =      {"rgb(255,170,0)"} 
                customDarkSquareStyle=  {{ backgroundColor: '#B58863' }}
                customLightSquareStyle= {{ backgroundColor: '#F0D9B5' }}
                position=               {game.fen()} onPieceDrop={onDrop}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
