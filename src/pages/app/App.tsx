import { Chessboard } from "react-chessboard";
import { useEffect, useRef, useState } from "react";
import { Chess, Square } from 'chess.js';
import { io, Socket } from "socket.io-client";
import { ShortMove } from "chess.js";
import UciEngineWorker from "features/workers/stockfish";
import { shortMoveToString } from "features/engine/chessEngine";
import { v4 as uuidv4 } from 'uuid';
import ConfirmButton from "features/components/confirmationButton";
import { isPromoting } from "features/engine/chessEngine";

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
  const [gameOn, setGameOn] = useState(false);

  const [firstCalculatedMove,  setFirstCalculatedMove]  = useState<MoveWithAssignment>(null);
  const [secondCalculatedMove, setSecondCalculatedMove] = useState<MoveWithAssignment>(null);
  const [thirdCalculatedMove,  setThirdCalculatedMove]  = useState<MoveWithAssignment>(null);

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

    socketRef.current?.on("createRoom", data => {
      setRoomCode(data);
    });

    socketRef.current?.on("startGame", data => {
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
        setFirstCalculatedMove(calculatedBestMove);
        setSecondCalculatedMove(randomCalculatedMove);
        setThirdCalculatedMove(randomMove);
      }).catch((msg) => {
        console.log(msg)
      })
    });
    return () => { socket.disconnect(); };
  }, [])

  function safeGameMutate(modify: any) {
    setGame((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }
  
  function handleRoomCodeChange(event: { target: { value: string }}) {
      setRoomCode(event.target.value)
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
        setFirstCalculatedMove(null);
        setSecondCalculatedMove(null);
        setThirdCalculatedMove(null);
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
                defaultText    = { "Calculating" }
                isBtnDisabled  = { (disabledSetter: Function) => {disabledSetter(firstCalculatedMove === null)}}
                buttonText     = { shortMoveToString(firstCalculatedMove?.move) }
                // onClickInitial = { () => { console.log("Preview first move") }}
                onClickInitial = { () => { if (firstCalculatedMove !== null) {
                  setBotMovePreviews(botMovePreviews => ()
                }
              }}
                onClickConfirm = { () => { if (firstCalculatedMove?.move) handleMove(firstCalculatedMove?.move)}}
                onClickCancel  = { () => { console.log("Preview first cancelled")}} />
              <ConfirmButton
                defaultText    = { "Calculating" }
                isBtnDisabled  = { (disabledSetter: Function) => {disabledSetter(secondCalculatedMove === null)}}
                buttonText     = { shortMoveToString(secondCalculatedMove?.move) }
                onClickInitial = { () => { console.log("Preview second move") }}
                // onClickInitial = { () => { if (secondCalculatedMove !== null) setBotMovePreviews([
                //   secondCalculatedMove?.move.from,
                //   secondCalculatedMove?.move.to
                // ]) }}
                onClickConfirm = { () => {if (secondCalculatedMove?.move) handleMove(secondCalculatedMove?.move)}}
                onClickCancel  = { () => { console.log("Preview second cancelled")}} />
              <ConfirmButton
                defaultText    = { "Calculating" }
                isBtnDisabled  = { (disabledSetter: Function) => {disabledSetter(thirdCalculatedMove === null)}}
                buttonText     = { shortMoveToString(thirdCalculatedMove?.move) }
                onClickInitial = { () => { console.log("Preview third move") }}
                // onClickInitial = { () => { if (thirdCalculatedMove !== null) setBotMovePreviews([
                //   thirdCalculatedMove?.move.from,
                //   thirdCalculatedMove?.move.to
                // ]) }}
                onClickConfirm = { () => {if (thirdCalculatedMove?.move) handleMove(thirdCalculatedMove?.move)}}
                onClickCancel  = { () => { console.log("Preview second cancelled")}} />
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
                customArrows={botMovePreviews }
                // customArrows={ [botMovePreviews]}
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
