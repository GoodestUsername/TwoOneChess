import { Chess, Move } from "chess.js";
import type { ShortMove } from "chess.js";

export type {ShortMove};

export type BoardOrientation = "white" | "black" | undefined;

export type MoveWithAssignment = {
  move: ShortMove,
  assignment: MoveAssignment
} | null;

export class MoveAssignment {
  // Create new instances of the same class as static attributes
  static best = new MoveAssignment("best")
  static middle = new MoveAssignment("middle")
  static random = new MoveAssignment("random")
  static worst = new MoveAssignment("worst")
  name: string;

  constructor(name: string) {
    this.name = name
  }
}
export const areMovesEqual = (moveOne: ShortMove, moveTwo: ShortMove) => {
  if (moveOne.to !== moveTwo.to) return false;
  if (moveOne.from !== moveTwo.from) return false;
  if (moveOne.promotion !== moveTwo.promotion) return false;
  return true;
}

export const shortMoveToString = (move: ShortMove | undefined) => {
    if (move) {
        return move.from + move.to + (move.promotion || "")
    } 
    else {
        return ""
    }
}

export function moveToShortMove(move: Move): ShortMove {
  if (move.promotion) return {from: move.from, to: move.to, promotion: move.promotion};
  return {from: move.from, to: move.to};
}

export function isPromoting(fen: string, move: ShortMove): boolean {
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

  // // check if it is the clients turn
  // export function isPlayerTurn(gameOn: boolean, playerColor: BoardOrientation, gameTurn: "b" | "w") {
  //   return (gameOn && playerColor && gameTurn === playerColor[0])
  // }
