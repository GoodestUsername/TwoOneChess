import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Chess } from 'chess.js';

// helper functions
import { shortMoveToString, isPromoting, isPlayerTurn } from "features/engine/chessEngine";
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';

// types
import { BoardOrientation, MoveAssignment, MoveWithAssignment} from "features/engine/chessEngine";
import { Square, ShortMove } from 'chess.js';
import { Socket } from "socket.io-client";

// worker
import UciEngineWorker from "features/workers/stockfish";

// components
import PreviewConfirmButton from "features/components/twoonechess/previewConfirmButton";
import { Chessboard } from "react-chessboard";

// context
import { SocketContext } from "context/socketContext";

const TOKEN_KEY = 'ACCESS_TOKEN';

const App = () => {
  // Socket Context
  const socket = useContext<Socket>(SocketContext);
  // Socket room info
  const [roomId, setRoomId] = useState<string>("");

  // Worker
  const stockfishRef = useRef<UciEngineWorker>();

  // Server Messages
  const [warningMessage, setwarningMessage] = useState("");
  const [serverMessage, setserverMessage] = useState("");

  // Game State
  const [game, setGame] = useState(new Chess());
  const [gameOn, setGameOn] = useState(false);
  const [playerColor, setPlayerColor] = useState<BoardOrientation>("white");

  // Bot Moves
  const [fBotMove, setFBotMove]  = useState<MoveWithAssignment>(null);
  const [sBotMove, setSBotMove] = useState<MoveWithAssignment>(null);
  const [tBotMove, setTBotMove]  = useState<MoveWithAssignment>(null);

  // Active bot move previews
  const [botMovePreviews, setBotMovePreviews] = useState<string[][]>([]);

  const startGame = useCallback((data: {color: string, gameKey: string, roomId: string}) => {
    const cookies = new Cookies();
    setPlayerColor(data.color);
    setGameOn(true);
    const newGame = new Chess();
    setGame(newGame);
    stockfishRef.current?.setPgn(newGame.pgn());
    cookies.set(TOKEN_KEY, {...data}, { path: '/', secure: true })
  }, [])

  const reconnectGame = useCallback((data: {roomId: string, gameHistory: string, pgn: string}) => {
    socket.emit("syncGame", {
      roomId: data.roomId,
      gameHistory: stockfishRef.current?.moveHistory,
      pgn: stockfishRef.current?.pgn,
    })
  }, [socket]);

  const restoreGame = useCallback((data: {roomId: string, gameHistory: string, pgn: string}) => {n
    const cookies = new Cookies();
    const restoredGame = new Chess();
    restoredGame.load_pgn(data.pgn);

    stockfishRef.current?.setMoveHistory(data.gameHistory);
    stockfishRef.current?.setPgn(data.pgn);

    setRoomId(data.roomId)
    setPlayerColor(cookies.get(TOKEN_KEY).color);
    setGame(restoredGame);
    setGameOn(true);
  }, []);

  useEffect(() => {
    const cookies = new Cookies();
    stockfishRef.current = new UciEngineWorker("stockfish.js");  

    socket.on("connect", () => {
      socket.emit("register", cookies.get(TOKEN_KEY))
    });

    socket.on("reconnectGame", reconnectGame);

    socket.on("serverMessage", data => {
      setserverMessage(data);
    })

    socket.on("sendRoomCode", data => {
      setRoomId(data);
    });

    socket.on("startGame", startGame);

    socket.on("restoreGame", restoreGame)

    socket.on("issueWarning", data => {
      setwarningMessage(data.message);
    });

    socket.on("opponentMove", data => {
      const proxyGame = new Chess();
      proxyGame.load_pgn(data.pgn);
      setGame(proxyGame);

      const availableMoves = proxyGame.moves({verbose: true});
      
      // set stockfish internal history
      stockfishRef.current?.setMoveHistory(data.moveHistory)
      stockfishRef.current?.setPgn(data.pgn)

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
        
        let moves = [randomMove, calculatedBestMove, randomCalculatedMove];
        let assignedMoves: number[] = [0, 1, 2];
        let setters = [setFBotMove, setSBotMove, setTBotMove];

        // set the calculated moves
        setters.forEach(setter => {
          let selectedMove:number = assignedMoves[Math.floor(Math.random() * assignedMoves.length)];
          assignedMoves = [...assignedMoves.filter(aM => aM !== selectedMove)];
          setter(moves[selectedMove]);
        });
      }).catch((msg) => {
        console.log(msg)
      })
    });

    return () => { 
      socket.disconnect(); };
  }, [socket, reconnectGame, restoreGame, startGame])

  // function that handle game state changes
  function safeGameMutate(modify: any) {
    setGame((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  // handles room code changing
  function handleRoomCodeChange(event: { target: { value: string }}) {
      setRoomId(event.target.value)
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
    if (!isPlayerTurn(gameOn, playerColor, game.turn())) return null;

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

  // calls handle move for validation and emits valid moves with socket, returns whether or not move is valid
  function handleMoveAndSend(inputtedMove: ShortMove) {
    const validMove = handleMove(inputtedMove)
    if (validMove) {
      const history = stockfishRef.current?.moveHistory + " " + shortMoveToString(validMove)
      const pgn = game.pgn()
      stockfishRef.current?.setMoveHistory(history);
      stockfishRef.current?.setPgn(pgn);
      socket.emit("sendMove", {
        pgn: pgn,
        moveHistory: history,
        roomId: roomId,
      });
    }
    return validMove === null;
  }

  // function called on piece drop
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    return handleMoveAndSend({from: sourceSquare, to: targetSquare})
  }
  

  return (
    <div className="App" style={{background: "#000000", color: "#d3d3d3"}}>
      <div className="">
        <div className="">
          <div className="">
            <p>{warningMessage}</p>
            <p>{serverMessage}</p>
            <button onClick={ () => { socket.emit("createGame", uuidv4()) } }>Create Game</button>
            <p>Your room code: {roomId}</p>
            <input type="text" placeholder="Enter Room Code" onChange={handleRoomCodeChange}></input>
            <button onClick={ () => { socket.emit("joinGame", {roomId: roomId, gameKey: null}) } }>join</button>

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
                customArrows           = { botMovePreviews }
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
