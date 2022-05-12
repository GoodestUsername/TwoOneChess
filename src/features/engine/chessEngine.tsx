import { Chess } from "chess.js";
import type { ShortMove } from "chess.js";

export type {ShortMove};

export const shortMoveToString = (move: ShortMove | undefined) => {
    if (move) {
        return move.from + move.to + (move.promotion || "")
    } 
    else {
        return ""
    }
}