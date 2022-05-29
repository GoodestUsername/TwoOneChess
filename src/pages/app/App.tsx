import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Chess } from 'chess.js';

// helper functions
import { shortMoveToString, isPromoting, isPlayerTurn, areMovesEqual } from "features/engine/chessEngine";
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

/**
 * Shuffles array in place.
 * source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array/6274381#6274381
 * @param {Array} a items An array containing the items.
 */
 function shuffle(a: any[]) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
  return a;
}
/**
 * Gets a random element in array
 * @param {Array} array items An array containing the items.
 */
function getRanElement(array: any[]) {
  return array[Math.floor(Math.random() * array.length)]
}

const App = () => {
  // Socket Context
  const socket = useContext<Socket>(SocketContext);
  // Socket room info
  const [roomId, setRoomId] = useState<string>("");

  // Worker
  const stockfishRef = useRef<UciEngineWorker>();

  // Server Messages
  const [warningMessage, setWarningMessage] = useState("");
  const [serverMessage, setserverMessage] = useState("");

  // Game State
  const [game, setGame] = useState(new Chess());
  const [gameOn, setGameOn] = useState(false);
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

    setPlayerColor(data.color);
    setGameOn(true);
    setGame(game);

    setFBotMove(null);
    setSBotMove(null);
    setTBotMove(null);
    stockfishRef.current?.setPgn(game.pgn());
    cookies.set(TOKEN_KEY, {...data}, { path: '/', secure: true })
  }, [])

  const onReconnectGame = useCallback((data: {roomId: string, gameHistory: string, pgn: string}) => {
    socket.emit("syncGame", {
      roomId: data.roomId,
      gameHistory: stockfishRef.current?.moveHistory,
      pgn: stockfishRef.current?.pgn,
    })
  }, [socket]);

  const onRestoreGame = useCallback((data: {roomId: string, gameHistory: string, pgn: string}) => {
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

  const onOpponentMove = useCallback((data: { pgn: string; moveHistory: string; }) => {
    const proxyGame = new Chess();
    proxyGame.load_pgn(data.pgn);

    // set stockfish internal history
    stockfishRef.current?.setMoveHistory(data.moveHistory);
    stockfishRef.current?.setPgn(data.pgn);

    setGame(proxyGame);
    const allMoves = proxyGame.moves({verbose: true});
    
    stockfishRef.current?.getMoves().then(({calcMoves, bestMove}: any) => {
      // Select bot moves
      const calcBestMove: MoveWithAssignment = {move: bestMove, assignment: MoveAssignment.best};
      const randCalcMove: MoveWithAssignment = {
        move: calcMoves.find((m: { move: ShortMove; }) => !areMovesEqual(m.move, calcBestMove.move)).move
        || getRanElement(calcMoves).move, 
        assignment: MoveAssignment.middle};

      // randomly select a move
      const randomMove: MoveWithAssignment = {
        move: allMoves.find((m) => !areMovesEqual(m, calcBestMove.move) && !areMovesEqual(m, randCalcMove.move))
        || getRanElement(allMoves),
        assignment: MoveAssignment.random
      };

      // Shuffle moves
      const moves = shuffle([randomMove, calcBestMove, randCalcMove]);

      // Set Moves
      setFBotMove(moves[0]);
      setSBotMove(moves[1]);
      setTBotMove(moves[2]);
    }).catch((msg) => {
      console.log(msg);
    })
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
    console.log(validMove);
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
