import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Chess, ChessInstance } from 'chess.js';
import { toast } from 'react-toastify';

// helper functions
import Cookies from 'universal-cookie';
import { shuffle } from "util/helpers";

// types
import { BoardOrientation, GameOverStates, MoveWithAssignment} from "features/engine/chessEngine";
import { Square, ShortMove } from 'chess.js';
import { Socket } from "socket.io-client";

// engine
import GameEngine from 'features/engine/twoOneGameEngine';

// components
import HistoryWindow, { toTurnHistory, TurnHistory } from "../HistoryWindow";
import TwoOneChessboard from "./TwoOneChessboard";

// material ui components
import { Grid } from "@mui/material";

// context
import { SocketContext } from "context/socketContext";
import BoardTopBar from "./BoardTopBar";



// constants
const TOKEN_KEY = 'ACCESS_TOKEN';

interface TwoOneChessInterface {
  roomId: string;
}

const TwoOneChess: React.FC<TwoOneChessInterface> = ({roomId}) => {
  // Socket Context
  const socket = useContext<Socket>(SocketContext);

  // engine
  const gameEngineRef = useRef<GameEngine>();

  // Game State
  const [game, setGame] = useState<ChessInstance>(new Chess());
  const [gameStarted, setGameStarted] = useState(false);
  const [chessBoardActive, setChessBoardActive] = useState(false);
  const [playerColor, setPlayerColor] = useState<BoardOrientation>("white");
  const [history, setHistory] = useState<Array<TurnHistory>>([]);

  // Bot Moves
  const [fBotMove, setFBotMove] = useState<MoveWithAssignment>(null);
  const [sBotMove, setSBotMove] = useState<MoveWithAssignment>(null);
  const [tBotMove, setTBotMove] = useState<MoveWithAssignment>(null);

  // Active bot move previews
  const [botMovePreviews, setBotMovePreviews] = useState<string[][]>([]);

  const fetchBotMoves = async () => {
    const goodMoves: any = await gameEngineRef.current!.getGoodBotMoves();
    const badMove: any = await gameEngineRef.current!.getBadBotMoves();
    const moves = shuffle([...goodMoves, badMove])
    // Set Moves
    if (gameEngineRef.current?.isPlayerTurn()) {
      setFBotMove(moves[0]);
      setSBotMove(moves[1]);
      setTBotMove(moves[2]);
    }
  }

  // functions that handle game state/game ui changes
  function safeGameMutate(modify: any) {
    setGame((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  const handleGameOverConditions = useCallback((roomId: string) => {
    const gameOverState = gameEngineRef.current?.gameOverState;
    if (gameOverState) {
      setChessBoardActive(false);
      socket.emit("gameOver", roomId);
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
  }, [socket])

  // handles move input and sends the move via socket
  function handleMoveAndSend(inputtedMove: ShortMove) {
    const validMove = gameEngineRef.current!.handleMove(inputtedMove);
    if (validMove && chessBoardActive) {
      safeGameMutate((game: any) => {
        game.move(validMove);
      });
      const pgn = gameEngineRef.current!.game.pgn();
      socket.emit("sendMove", {
        pgn: pgn,
        roomId: roomId,
      });
      const turnHistory = toTurnHistory(gameEngineRef.current?.game.history({verbose:true}))
      if (turnHistory) setHistory(turnHistory);
      handleGameOverConditions(roomId);
      setFBotMove(null);
      setSBotMove(null);
      setTBotMove(null);
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
    setGameStarted(true);
    gameEngineRef.current?.startGame(data.color);
    setPlayerColor(data.color);
    if (gameEngineRef.current?.isPlayerTurn()) fetchBotMoves()
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
    if (gameEngineRef.current?.isPlayerTurn()) fetchBotMoves();
    const turnHistory = toTurnHistory(gameEngineRef.current?.game.history({verbose:true}))
    if (turnHistory) setHistory(turnHistory);
    setGameStarted(true);
    setPlayerColor(color);
    setChessBoardActive(true);
    handleGameOverConditions(data.roomId);
  }, [handleGameOverConditions]);

  const onOpponentMove = useCallback((data: { pgn: string, roomId: string}) => {
    gameEngineRef.current!.setPgn(data.pgn);
    const turnHistory = toTurnHistory(gameEngineRef.current?.game.history({verbose:true}))
    if (turnHistory) setHistory(turnHistory);
    setGame(gameEngineRef.current!.game);
    handleGameOverConditions(data.roomId);

    fetchBotMoves();
  }, [handleGameOverConditions]);

  useEffect(() => {
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
    <Grid
      container
      spacing={1}
      direction="row"
      display="flex"
      alignItems="stretch"
      justifyContent={"Center"}>
        <Grid item>
          <BoardTopBar/>
          <TwoOneChessboard 
            boardOrientation={playerColor}
            position={game.fen()} 
            customArrows={botMovePreviews} 
            onDropHandler={onDrop} 
            bottomButtonsActive={gameStarted}
            handleMove={handleMoveAndSend}
            setPreview={setBotMovePreviews}
            bottomButtonMoves={{
                fBotMove,
                sBotMove,
                tBotMove
            }} />
        </Grid>
        <Grid item sx={{maxWidth: "568px", flexGrow:1, height: "inherit"}}>
          {history && 
            <HistoryWindow history={history} />
          }
        </Grid>
      </Grid>
  );
}

export default TwoOneChess;