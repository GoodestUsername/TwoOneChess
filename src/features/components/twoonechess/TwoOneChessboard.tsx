import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Chess, ChessInstance } from 'chess.js';
import { toast } from 'react-toastify';

// helper functions
import Cookies from 'universal-cookie';

// types
import { BoardOrientation, GameOverStates, MoveWithAssignment} from "features/engine/chessEngine";
import { Square, ShortMove } from 'chess.js';
import { Socket } from "socket.io-client";

// engine
import GameEngine from 'features/engine/gameEngine';

// worker
import UciEngineWorker from "features/workers/stockfish";

// components
import PreviewConfirmButton from "features/components/twoonechess/PreviewConfirmButton";
import { Chessboard } from "react-chessboard";

// context
import { SocketContext } from "context/socketContext";

const TOKEN_KEY = 'ACCESS_TOKEN';
interface GamePage {
  roomId: String;
}
const TwoOneChessboard: React.FC<GamePage> = (roomId) => {
  // Socket Context
  const socket = useContext<Socket>(SocketContext);

  // engine
  const gameEngineRef = useRef<GameEngine>();

  // Worker
  const stockfishRef = useRef<UciEngineWorker>();

  // Game State
  const [game, setGame] = useState<ChessInstance>(new Chess());
  const [chessBoardActive, setChessBoardActive] = useState(false);
  const [playerColor, setPlayerColor] = useState<BoardOrientation>("white");

  // Bot Moves
  const [fBotMove, setFBotMove] = useState<MoveWithAssignment>(null);
  const [sBotMove, setSBotMove] = useState<MoveWithAssignment>(null);
  const [tBotMove, setTBotMove] = useState<MoveWithAssignment>(null);

  // Active bot move previews
  const [botMovePreviews, setBotMovePreviews] = useState<string[][]>([]);

  // functions that handle game state/game ui changes
  function safeGameMutate(modify: any) {
    setGame((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function handleGameOverConditions() {
    const gameOverState = gameEngineRef.current?.gameOverState;
    if (gameOverState) {
      setChessBoardActive(false);
      switch (gameOverState) {  
        case GameOverStates.victory:
          toast.success(gameOverState.name)
          break;
        case GameOverStates.defeat:
          toast.warning(gameOverState.name)
          break;
        default:
          toast.info(gameOverState.name + " Draw")
          break;
      }
    }
  }

  // handles move input and sends the move via socket
  function handleMoveAndSend(inputtedMove: ShortMove) {
    const validMove = gameEngineRef.current!.handleMove(inputtedMove);
    if (validMove && chessBoardActive) {
      safeGameMutate((game: any) => {
        game.move(validMove);
      });
      setFBotMove(null);
      setSBotMove(null);
      setTBotMove(null);
      const pgn = gameEngineRef.current!.game.pgn();
      socket.emit("sendMove", {
        pgn: pgn,
        roomId: roomId.roomId,
      });
      handleGameOverConditions()
    }
    return validMove === null;
  }

  // function called on piece drop
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    return handleMoveAndSend({from: sourceSquare, to: targetSquare})
  }

  // Socket functions
  const onStartGame = useCallback((data: {color: BoardOrientation, gameKey: string, roomId: string}) => {
    const cookies = new Cookies();
    const game = new Chess();
    setGame(game);
    setChessBoardActive(true);
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
    setGame(gameEngineRef.current!.loadGame(data.pgn, color));
    setChessBoardActive(true);
    setPlayerColor(color)
  }, []);

  const onOpponentMove = useCallback((data: { pgn: string;}) => {
    gameEngineRef.current!.setPgn(data.pgn);
    setGame(gameEngineRef.current!.game);
    handleGameOverConditions()
    const fetchBotMoves = async () => {
      const moves: any = await gameEngineRef.current!.getBotMoves();
      // Set Moves
      if (gameEngineRef.current?.isPlayerTurn()) {
        setFBotMove(moves[0]);
        setSBotMove(moves[1]);
        setTBotMove(moves[2]);
      }
    }
    fetchBotMoves();
  }, []);

  useEffect(() => {
    stockfishRef.current = new UciEngineWorker("stockfish.js");  
    gameEngineRef.current = new GameEngine();
    socket.on("startGame", onStartGame);

    socket.on("restoreGame", onRestoreGame);

    socket.on("reconnectGame", onReconnectGame);

    socket.on("opponentMove", onOpponentMove);

    return () => { 
      socket.removeAllListeners();

      socket.disconnect(); 
    };
  }, [socket, onStartGame, onRestoreGame, onReconnectGame, onOpponentMove])

  return (
    <>
        <div
            style={{ 
            display: 'flex', 
            justifyContent: 'center'
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
        {chessBoardActive &&
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
        }
    </>
  );
}

export default TwoOneChessboard;
