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
  // const stockfish = useRef<UciEngineWorker>();
  // const socketRef = useRef<Socket>();


  useEffect(() => {
    // var stockfish = new Worker('stockfish.js');
    // var stuff = "";
    // var moves: { move: { from: any; to: any; }; cp: any; }[] = []
    // stockfish.addEventListener('message', function (e) {  
    //   var best  = e.data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
    //   var move  = e.data.match(/pv ([a-h][1-8])([a-h][1-8])([qrbn])?/);
    //   var cp    = e.data.match(/cp ([0-9]+)?/);
    //   var match = e.data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
    //   if (move) moves.push({move: {from: move[1], to: move[2]}, cp: cp[1]})
    //   // console.log(`${best}`)

    //   // console.log(e.data);
    // });
    var stockfish = new UciEngineWorker("stockfish.js");  
    console.log("asd")
    // let moves;
    stockfish.getMoves().then((moves: CalculatedMove[] | any) => {
        // moves = stockfish.moves;
        let sortedMoves = moves.sort((a: CalculatedMove, b: CalculatedMove) => b.cp - a.cp)
        let availableMoves = game.moves({verbose: true});
        let randomlySelectedMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
        let bestMove: MoveWithAssignment = {move: sortedMoves[0].move, assignment: MoveAssignment.best};
        let middleMove: MoveWithAssignment = {move: sortedMoves[sortedMoves.length - 1].move, assignment: MoveAssignment.best};
        let randomMove: MoveWithAssignment = {
          move: randomlySelectedMove,
          assignment: MoveAssignment.random
        }
        setFirstCalculatedMove(bestMove)
        setSecondCalculatedMove(middleMove)
        setThirdCalculatedMove(randomMove)
        console.log(moves)
        console.log(bestMove)
        console.log("asd")
      }
    )
    // stockfish.postMessage('uci');
    // stockfish.postMessage(`position fen ${game.fen()}`);
    // stockfish.postMessage(`position startpos moves`);
    // stockfish.postMessage('setoption name Skill Level value 0');
    // stockfish.postMessage('setoption name MultiPV value 3');
    // stockfish.postMessage('setoption name Use NNUE value true');
    // stockfish.postMessage('go depth 10');
    // stockfish.postMessage('go movetime 1000');
    // console.log(`unsorted: ${moves}`)
    // console.log("sorted: " + moves.sort((a, b) => parseInt(a.cp) - parseInt(b.cp)))
    // stockfish.postMessage('eval');
    // stockfish.postMessage('position startpos moves' + game.moves());
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

  function onDrop(sourceSquare: Square, targetSquare: Square) {
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
                safeGameMutate((game: any) => {
                  if (game && firstCalculatedMove) game.move(firstCalculatedMove.move);
                })
              }
            }>{firstCalculatedMove?.move.from}</button>
            <button value={"Calculating"}>{secondCalculatedMove?.move.from}</button>
            <button value={"Calculating"}>{thirdCalculatedMove?.move.from}</button>
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
