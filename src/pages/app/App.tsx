import { Chessboard } from "react-chessboard";
import { useEffect, useRef, useState } from "react";
import { Chess, Square } from 'chess.js';
import { io, Socket } from "socket.io-client";
import { CalculatedMove } from "features/workers/stockfish";
import { ShortMove } from "chess.js";
import UciEngineWorker from "features/workers/stockfish";
// const URL = 'http://localhost:3001';
const URL = "";

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
  const [gameOn, setGameOn] = useState(true);
  const [firstCalculatedMove,  setFirstCalculatedMove]  = useState<MoveWithAssignment>(null);
  const [secondCalculatedMove, setSecondCalculatedMove] = useState<MoveWithAssignment>(null);
  const [thirdCalculatedMove,  setThirdCalculatedMove]  = useState<MoveWithAssignment>(null);
  const stockfishRef = useRef<UciEngineWorker>();
  // const socketRef = useRef<Socket>();

  useEffect(() => {
    stockfishRef.current = new UciEngineWorker("stockfish.js");  
    // socketRef.current = io(URL, {
    //   transports: ['websocket'],
    //   forceNew: true
    // });
    // const {current: socket} = socketRef;

    // socket.on("FromAPI", data => {
    //   setResponse(data);
    // });

    // socketRef.current?.on("createRoom", data => {
    //   setRoomCode(data);
    // });

    // socketRef.current?.on("startGame", data => {
    //   setGameOn(true);
    //   setGame(new Chess())
    // })

    // return () => { socket.disconnect(); };
  }, [])
  useEffect(() => {
    stockfishRef.current?.getMoves().then(({allMoves, bestMove}: any) => {
        let availableMoves = game.moves({verbose: true});
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
        // console.log(game.moves());
        // console.log(moves)
        // get game history from class property later
        console.log(bestMove)
        // console.log("asd")
      }
    )
  }, [game]);

  // useEffect(()=>{
  //   socketRef.current?.on("opponentMove", data => {
  //     safeGameMutate((game: any) => {
  //       game.move(data);
  //     });
  //     console.log("received move", data)
  //   });
  // }, [game, gameOn])

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
    let move = null;
    let moveData: ShortMove = {
      from: sourceSquare,
      to: targetSquare,
      promotion: undefined,
    }
    if (isPromoting(game.fen(), moveData)) { moveData.promotion = "q" }
    console.log("moveData")
    console.log(isPromoting(game.fen(), moveData))
    console.log(moveData)
    if (gameOn) {
      safeGameMutate((game: any) => {
        move = game.move(moveData);
      });
    }

    if (move === null) return false; // illegal move
    else {
      stockfishRef.current?.addMoveToHistory(move);
      // socketRef.current?.emit("sendMove", {
      //   move: moveData,
      //   roomId: roomCode,
      // });
      return true;
    }
  }
  const handleRoomCodeChange = (event: { target: { value: string }}) => {
      setRoomCode(event.target.value)
  }

  return (
    <div className="App container">
      <div className="row align-items-center">
        <div className="col">
          <div className="col-1">
          <p>Current date: {response}</p>
            {/* <button onClick={() => {socketRef.current?.emit("createGame", roomCode)}}>Create Game</button> */}
            <p>Your room code: {roomCode}</p>
            <input type="text" placeholder="Enter Room Code" onChange={handleRoomCodeChange}></input>
            {/* <button onClick={() => {socketRef.current?.emit("joinGame", roomCode)}}>join</button> */}
            <button 
              value={"Calculating"}
              onClick={() => {
                if (game && firstCalculatedMove) 
                safeGameMutate((game: any) => {
                  game.move(firstCalculatedMove.move);
                })
              }
            }>{firstCalculatedMove?.move.from}{firstCalculatedMove?.move.to}</button>
            <button 
              value={"Calculating"}
              onClick={() => {
                if (game && secondCalculatedMove)
                safeGameMutate((game: any) => {
                  game.move(secondCalculatedMove.move);
                })
              }
            }>{secondCalculatedMove?.move.from}{secondCalculatedMove?.move.to}</button>
            <button 
              value={"Calculating"}
              onClick={() => {
                if (game && thirdCalculatedMove) 
                safeGameMutate((game: any) => {
                  game.move(thirdCalculatedMove.move);
                })
              }
            }>{thirdCalculatedMove?.move.from}{thirdCalculatedMove?.move.to}</button>
            <Chessboard
              // customSquareStyles =    {{"e1": {fontWeight: "bold"}}}
              customArrows={ [ ['a3', 'a5'], ['g1', 'f3'] ]}
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
  );
}

export default App;
