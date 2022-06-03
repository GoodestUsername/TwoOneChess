import UciEngineWorker from "features/workers/stockfish";
import { areMovesEqual, BoardOrientation, GameOverStates, getGameOverState, isPromoting, MoveAssignment, MoveWithAssignment } from "./chessEngine";
import { Chess, ChessInstance, ShortMove } from 'chess.js';;

const stockfishFile = "stockfish.js"
/**
 * Gets a random element in array
 * @param {Array} array items An array containing the items.
 */
function getRanElement(array: any[]) {
    return array[Math.floor(Math.random() * array.length)]
}

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

class GameEngine {
    private _game: ChessInstance;
    public get game(): ChessInstance {
        return this._game;
    }
    private _gameOn: boolean;
    public get gameOn(): boolean {
        return this._gameOn;
    }
    private _gameTurn: "w" | "b" | null;
    public get gameTurn(): "w" | "b" | null {
        return this._gameTurn;
    }
    private _gameOverState: GameOverStates | null;
    public get gameOverState(): GameOverStates | null {
        return this._gameOverState;
    }
    public set gameTurn(value: "w" | "b" | null) {
        this._gameTurn = value;
    }
    private _clientColor: BoardOrientation;
    public get clientColor(): BoardOrientation {
        return this._clientColor;
    }
    public set clientColor(value: BoardOrientation) {
        this._clientColor = value;
    }
    chessBot:    UciEngineWorker;

    constructor() {
        this.chessBot = new UciEngineWorker(stockfishFile);
        this._game = new Chess();
        this._gameOn = false;
        this._gameTurn = null;
        this._gameOverState = null;
    }
    startGame(playerColor: BoardOrientation, ) {
        this._game = new Chess();
        this._gameOn = true;
        this._gameOverState = null;
        this._clientColor = playerColor
    }

    loadGame(pgn: string, clientColor: BoardOrientation): ChessInstance {
        this._game = new Chess();
        this._game.load_pgn(pgn);
        this.clientColor = clientColor;
        this._gameOn = !this.game.game_over();
        this._gameOverState = getGameOverState(this._game.pgn(), this.isPlayerTurn());
        return this._game;
    }

    checkGameOver() {
        const gameOverState = getGameOverState(this.game.pgn(), this.isPlayerTurn())
        if (gameOverState) {
            this._gameOn = false;
            this._gameOverState = gameOverState;
        }
    }

    setPgn(pgn: string) {
        if (this.gameOn) { this._game.load_pgn(pgn) }
        this.checkGameOver()
    }

    // handles sending move to game state with validation, and returns move if valid or false if not
    handleMove(inputtedMove: ShortMove) {
        const moveData: ShortMove = {
            from: inputtedMove.from,
            to: inputtedMove.to,
            promotion: undefined,
        }

        // if the game hasnt started or is over
        if (!this._game || !this._gameOn) return null;

        // check for promotion, and set to queen for simplicity
        if (isPromoting(this._game.fen(), moveData)) { moveData.promotion = "q" }

        // check if it is the clients turn
        if (!this.isPlayerTurn()) return null;

        // check if move is valid
        if (this._game.move(moveData) === null) return null; // illegal move, return null
        
        this.checkGameOver()
        return moveData;
    }

    // check if it is the clients turn
    isPlayerTurn(): boolean {
        if (this._gameOn && this._clientColor && this._game.turn() === this._clientColor[0]) return true
        return false;
    }
    
    async getBotMoves() {
        if (this.gameOn && this.isPlayerTurn()) {
            return new Promise(resolve => {
                this.chessBot.getMoves(this.game.history({verbose:true})).then(({calcMoves, bestMove}: any) => {
                    // Select bot moves
                    const allMoves = this.game.moves({verbose: true});
                    const calcBestMove: MoveWithAssignment = { move: bestMove, assignment: MoveAssignment.best };
                    const randCalcMove: MoveWithAssignment = {
                    move: calcMoves.find((m: { move: ShortMove; }) => !areMovesEqual(m.move, calcBestMove.move)).move
                    || getRanElement(calcMoves).move, 
                    assignment: MoveAssignment.middle };

                    // randomly select a move
                    const randomMove: MoveWithAssignment = {
                    move: allMoves.find((m) => !areMovesEqual(m, calcBestMove.move) && !areMovesEqual(m, randCalcMove.move))
                    || getRanElement(allMoves),
                    assignment: MoveAssignment.random };

                    // Shuffle moves
                    resolve(shuffle([randomMove, calcBestMove, randCalcMove]));
              }).catch((msg) => {
                  console.log(msg);
              })
            })
        }
    }
}

export default GameEngine;