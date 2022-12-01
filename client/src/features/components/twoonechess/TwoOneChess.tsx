import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Chess, ChessInstance } from 'chess.js';
import { toast } from 'react-toastify';

// helper functions
import Cookies from 'universal-cookie';
import { shuffle } from "util/helpers";
import { addMoveToHistory, setHistory, toTurnHistory } from "features/components/twoonechess/historySlice";

// types
import { BoardOrientation, GameOverStates, MoveWithAssignment} from "features/engine/chessEngine";
import { Square, ShortMove } from 'chess.js';
import { Socket } from "socket.io-client";

// engine
import GameEngine from 'features/engine/twoOneGameEngine';

// components
import HistoryWindow from "features/components/twoonechess/HistoryWindow";
import TwoOneChessboard from "./TwoOneChessboard";

// material ui components
import { Grid } from "@mui/material";

// context
import { SocketContext } from "context/socketContext";
import BoardTopBar from "./BoardTopBar";
import { useMediaQuery } from "react-responsive";
import { useDispatch } from "react-redux";
import { AppDispatch } from "util/store";

// constants
const TOKEN_KEY = 'ACCESS_TOKEN';

interface TwoOneChessInterface {
  roomId: string;
}

/**
 * Chessboard component that allows the user to play the game
 * @param {String} {roomId} roomcode of socket room
 * @returns TwoOneChess component
 */
const TwoOneChess: React.FC<TwoOneChessInterface> = ({roomId}) => {
  // redux
  const dispatch = useDispatch<AppDispatch>();

  // Socket Context
  const socket = useContext<Socket>(SocketContext);

  // is screen size hooks
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  
  // engine
  const gameEngineRef = useRef<GameEngine>();

  // Game State
  const [game, setGame] = useState<ChessInstance>(new Chess());
  const [gameStarted, setGameStarted] = useState(false);
  const [chessBoardActive, setChessBoardActive] = useState(false);
  const [playerColor, setPlayerColor] = useState<BoardOrientation>("white");

  // Bot Moves
  const [fBotMove, setFBotMove] = useState<MoveWithAssignment>(null);
  const [sBotMove, setSBotMove] = useState<MoveWithAssignment>(null);
  const [tBotMove, setTBotMove] = useState<MoveWithAssignment>(null);

  // Active bot move previews
  const [botMovePreviews, setBotMovePreviews] = useState<string[][]>([]);

  /**
   * Fetch bot moves from the engine and sets them to the 3 bot moves
   */
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

  /**
   * Adds the last move in game engine history to movehistory in store
   */
  const addNewMoveToHistory = useCallback(() => {
    const gameHistory = gameEngineRef.current?.game.history({verbose:true})
    if (gameHistory?.at(-1)) dispatch(addMoveToHistory({newMove: gameHistory.at(-1)}));
  }, [dispatch])

  /**
   * functions that handle game state/game ui changes
   */
  function safeGameMutate(modify: any) {
    setGame((g: any) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  /** 
   * Checks if the game state is in a game over state, and ends the game and emits gameOver if it is.
   * @param {String} {roomId} roomcode of socket room
   */
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

  /**
   * handles move input and sends the move via socket
   * @param {ShortMove} inputtedMove
   * @returns true if move is valid else false
   */
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
      addNewMoveToHistory();
      handleGameOverConditions(roomId);
      setFBotMove(null);
      setSBotMove(null);
      setTBotMove(null);
    }
    return validMove === null;
  }

  /**
   * Function called on piece drop
   * @param {Square} sourceSquare { Source square }
   * @param {Square} targetSquare { target square }
   * @returns boolean handled by handleMoveAndSend, true if the move is valid, else false
   */
  function onDrop(sourceSquare: Square, targetSquare: Square) {
    return handleMoveAndSend({from: sourceSquare, to: targetSquare})
  }

  // Socket functions
  /** 
   * Function called on starting the game
   * @param {BoardOrientation} color { Board orientation in color, black or white }
   * @param {gameKey} string{ gamekey for socket } 
   * @param {roomId} string} { roomcode for socket }
   */
  const onStartGame = useCallback((data: {color: BoardOrientation, gameKey: string, roomId: string}) => {
    // set the cookeis
    const cookies = new Cookies();
    cookies.set(TOKEN_KEY, {...data}, { path: '/', secure: true })
    
    // sets the game to a new Chess object
    const game = new Chess();
    setGame(game);

    // set boardactive and game started to true
    setChessBoardActive(true);
    setGameStarted(true);

    // sets the player color
    gameEngineRef.current?.startGame(data.color);
    setPlayerColor(data.color);

    // calculate bot moves if it is the players turn
    if (gameEngineRef.current?.isPlayerTurn()) { fetchBotMoves(); return; }

    // empty all bot moves
    setFBotMove(null);
    setSBotMove(null);
    setTBotMove(null);
  }, [])

  /** 
   * Function called on reconnecting the game
   * @param {roomId} string} { roomcode for socket }
   * @param {pgn} string{ chess game state in pgn format } 
   */
  const onReconnectGame = useCallback((data: {roomId: string, pgn: string}) => {
    socket.emit("syncGame", {
      roomId: data.roomId,
      pgn: gameEngineRef.current?.game.pgn(),
    })
  }, [socket]);

  /** 
   * Function called on restoring the game
   * @param {roomId} string} { roomcode for socket }
   * @param {pgn} string{ chess game state in pgn format } 
   */
  const onRestoreGame = useCallback((data: {roomId: string, pgn: string}) => {
    // get color from cookies and set it
    const cookies = new Cookies();
    const color =  cookies.get(TOKEN_KEY).color;
    setPlayerColor(color);

    // load Chess state in gameEngine with pgn
    setGame(gameEngineRef.current!.loadGame(data.pgn, color));

    // fetch moves if it is the players turn
    if (gameEngineRef.current?.isPlayerTurn()) fetchBotMoves();

    // sets the turn and move history
    const turnHistory = toTurnHistory(gameEngineRef.current?.game.history({verbose:true}))
    if (turnHistory) dispatch(setHistory({ newHistory: turnHistory }));

    // set gamestarted, chessboardactive to true
    setGameStarted(true);
    setChessBoardActive(true);

    // check if game is over
    handleGameOverConditions(data.roomId);
  }, [dispatch, handleGameOverConditions]);

  /** 
   * Function called when the opponent moves
   * @param {roomId} string} { roomcode for socket }
   * @param {pgn} string{ chess game state in pgn format } 
   */
  const onOpponentMove = useCallback((data: { pgn: string, roomId: string}) => {
    // set the gamestate with pgn
    gameEngineRef.current!.setPgn(data.pgn);
    setGame(gameEngineRef.current!.game);

    // add the new move to history
    addNewMoveToHistory();

    // check if the game is over
    handleGameOverConditions(data.roomId);

    // fetch engine moves
    fetchBotMoves();
  }, [addNewMoveToHistory, handleGameOverConditions]);

  useEffect(() => {
    gameEngineRef.current = new GameEngine();
    socket.on("startGame", onStartGame);

    socket.on("restoreGame", onRestoreGame);

    socket.on("reconnectGame", onReconnectGame);

    socket.on("opponentMove", onOpponentMove);

    return () => {
      // clean up
      socket.removeAllListeners();

      socket.disconnect(); 
    };
  }, [socket, onStartGame, onRestoreGame, onReconnectGame, onOpponentMove])

  return (
      <Grid
        container
        sx={{marginTop: "20px"}}
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
          {/* remove margin if the device is on mobile */}
          <Grid item sx={{maxWidth: (isMobile ? "none" : "568px"), flexGrow:1, height: "inherit"}}>
            <HistoryWindow/>
          </Grid>
      </Grid>
  );
}

export default TwoOneChess;