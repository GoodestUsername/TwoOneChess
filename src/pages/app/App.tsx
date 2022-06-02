import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Chess, ChessInstance } from 'chess.js';

// helper functions
import Cookies from 'universal-cookie';
import { v4 as uuidv4 } from 'uuid';

// types
import { BoardOrientation, MoveWithAssignment} from "features/engine/chessEngine";
import { Square, ShortMove } from 'chess.js';
import { Socket } from "socket.io-client";

// engine
import GameEngine from 'features/engine/gameEngine';

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

  // engine
  const gameEngineRef = useRef<GameEngine>();

  // Worker
  const stockfishRef = useRef<UciEngineWorker>();

  // Server Messages
  const [warningMessage, setWarningMessage] = useState("");
  const [serverMessage, setserverMessage] = useState("");

  // Game State
  const [game, setGame] = useState<ChessInstance>(new Chess());
  // const [gameOn, setGameOn] = useState(false);
  const [playerColor, setPlayerColor] = useState<BoardOrientation>("white");

  // Bot Moves
  const [fBotMove, setFBotMove] = useState<MoveWithAssignment>(null);
  const [sBotMove, setSBotMove] = useState<MoveWithAssignment>(null);
  const [tBotMove, setTBotMove] = useState<MoveWithAssignment>(null);

  // Active bot move previews
  const [botMovePreviews, setBotMovePreviews] = useState<string[][]>([]);
  
  // Socket functions
  const onConnect = useCallback(() => {
    const cookies = new Cookies();
    socket.emit("register", cookies.get(TOKEN_KEY))
  }, [socket])

  const onStartGame = useCallback((data: {color: BoardOrientation, gameKey: string, roomId: string}) => {
    const cookies = new Cookies();
    const game = new Chess();
    setGame(game);

    gameEngineRef.current?.startGame(data.color);
    setPlayerColor(data.color);

    setFBotMove(null);
    setSBotMove(null);
    setTBotMove(null);
    cookies.set(TOKEN_KEY, {...data}, { path: '/', secure: true })
  }, [])

  const onReconnectGame = useCallback((data: {roomId: string, pgn: string}) => {
    socket.emit("syncGame", {
      roomId: data.roomId,
      pgn: gameEngineRef.current?.game.pgn(),
    })
  }, [socket]);

  const onRestoreGame = useCallback((data: {roomId: string, pgn: string}) => {
    const cookies = new Cookies();
    const color =  cookies.get(TOKEN_KEY).color;
    setRoomId(data.roomId);
    setGame(gameEngineRef.current!.loadGame(data.pgn, color));
    setPlayerColor(color)
  }, []);

  const onOpponentMove = useCallback((data: { pgn: string;}) => {
    gameEngineRef.current!.game.load_pgn(data.pgn);
    setGame(gameEngineRef.current!.game);
    const fetchBotMoves = async () => {
      const moves: any = await gameEngineRef.current!.getBotMoves();
      // Set Moves
      console.log(gameEngineRef.current?.isPlayerTurn()) 
      if (gameEngineRef.current?.isPlayerTurn()) {
        setFBotMove(moves[0]);
        setSBotMove(moves[1]);
        setTBotMove(moves[2]);
      }
    }
    fetchBotMoves();
}, []);

  const onServerMessage = useCallback((data: {msg: string}) => {
    setserverMessage(data.msg);
  }, []);
  const onIssueWarning = useCallback((data: {msg: string}) => {
    setWarningMessage(data.msg);
  }, []);

  const onSendRoomCode = useCallback((data: {roomId: string}) => {
      setRoomId(data.roomId);
  }, []);

  useEffect(() => {
    stockfishRef.current = new UciEngineWorker("stockfish.js");  
    gameEngineRef.current = new GameEngine();
    socket.on("connect", onConnect);

    socket.on("startGame", onStartGame);

    socket.on("restoreGame", onRestoreGame);

    socket.on("sendRoomCode", onSendRoomCode);

    socket.on("issueWarning", onIssueWarning);

    socket.on("reconnectGame", onReconnectGame);
    
    socket.on("serverMessage", onServerMessage);

    socket.on("opponentMove", onOpponentMove);

    return () => { 
      socket.removeAllListeners();

      socket.disconnect(); 
    };
  }, [socket, onConnect, onStartGame, onRestoreGame, onSendRoomCode, onIssueWarning, onReconnectGame, onServerMessage, onOpponentMove])

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
    setRoomId(event.target.value);
  }

  // function called on piece drop
  function handleMoveAndSend(inputtedMove: ShortMove) {
    const validMove = gameEngineRef.current!.handleMove(inputtedMove);
    console.log(validMove);
    if (validMove) {
      safeGameMutate((game: any) => { 
        game.move(validMove);
      });
      // setGame(gameEngineRef.current!.game);
      setFBotMove(null);
      setSBotMove(null);
      setTBotMove(null);
      const pgn = gameEngineRef.current!.game.pgn();
      socket.emit("sendMove", {
        pgn: pgn,
        roomId: roomId,
      });
    }
    return validMove === null;
  }
  
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
