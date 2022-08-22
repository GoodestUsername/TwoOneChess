import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "util/store";

import { Move } from "chess.js";
import { shortMoveToString } from "features/engine/chessEngine";


export type TurnHistory = {
    turn: number,
    white: string,
    black: string
}

// converts list of moves into turn history
export const toTurnHistory = (moveList: Move[] | undefined): Array<TurnHistory>=> {
    if (moveList === undefined) return [];
    const turns:Array<TurnHistory> = [];

    for (let i = 0, turnNum = 1; i < moveList.length; i += 2, turnNum += 1) {
        const turn:TurnHistory = { turn: turnNum, white: shortMoveToString(moveList[i]), black: shortMoveToString(moveList[i + 1])};
        turns.push(turn);
    }
    return turns;
}

export interface HistoryState {
    history: Array<TurnHistory>;
}

const historyInitialState: HistoryState = {
    history: [],
}

// history slice, state contains single array of TurnHistory objects
const historySlice = createSlice({
    name: 'history',
    initialState: historyInitialState,
    reducers: {
        /**
         * Adds new move to history
         * @param {HistoryState} state { current history slice state, an array of TurnHistory Objects}
         * @param {(PayloadAction<{ newMove: Move | undefined }>)} { payload containing the new move }
         * @returns undefined
         */
        addMoveToHistory: (state: HistoryState, { payload }: PayloadAction<{ newMove: Move | undefined }>) => {
            const oldHistory = [...state.history];
            const lastTurn = oldHistory.pop();
            if (payload.newMove === undefined) return;
            
            // if last turn is undefined, that means it is empty and a new game has started,
            // white always goes first so we make a new turn history object with whites move
            if (lastTurn === undefined) {
                state.history = [{turn: 1, white: shortMoveToString(payload.newMove), black: ""}];
                return;
            }

            // if both players have moved, make a new turn history object with the new move assigned to white 
            if (lastTurn?.white !== "" && lastTurn?.black !== "" ) {
                state.history = [...oldHistory, lastTurn, {turn: lastTurn?.turn + 1, white: shortMoveToString(payload.newMove), black: ""}];
                return;
            }
            
            // if white is empty fill white
            if (lastTurn?.white === "") {
                state.history = [...oldHistory, {turn: lastTurn?.turn, white: shortMoveToString(payload.newMove), black: ""}];
                return;
            }

            // if we got to this point and black isnt filled, that means it must go to black
            if (lastTurn?.black === "") {
                state.history = [...oldHistory, {turn: lastTurn?.turn, white: lastTurn?.white, black: shortMoveToString(payload.newMove)}];
                return;
            }
        },
        /**
         * set history array to a new array
         * @param {HistoryState} state { current history slice state, an array of TurnHistory Objects}
         * @param {PayloadAction<{ newHistory: Array<TurnHistory> }>} { payload containing the new history array }
         */
        setHistory:(state: HistoryState, { payload }: PayloadAction<{ newHistory: Array<TurnHistory> }>) => {
            state.history = payload.newHistory;
        },
        /**
         * clears the history array
         * @param {HistoryState} state { current history slice state, an array of TurnHistory Objects}
         */
        clearHistory: (state: HistoryState) => {
            state.history = [];
        }
    }
})
export const { addMoveToHistory, setHistory, clearHistory } = historySlice.actions;
export const selectHistory = (state: RootState) => state.history.history;
export default historySlice;