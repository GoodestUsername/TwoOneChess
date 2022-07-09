import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "util/store";

import { Move } from "chess.js";
import { shortMoveToString } from "features/engine/chessEngine";


export type TurnHistory = {
    turn: number,
    white: string,
    black: string
}

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

const historySlice = createSlice({
    name: 'history',
    initialState: historyInitialState,
    reducers: {
        addMoveToHistory: (state, { payload }: PayloadAction<{ newMove: Move | undefined }>) => {
            const oldHistory = [...state.history];
            const lastTurn = oldHistory.pop();
            if (payload.newMove === undefined) return;
            
            if (lastTurn === undefined) {
                state.history = [{turn: 1, white: shortMoveToString(payload.newMove), black: ""}];
                return;
            }
            if (lastTurn?.white !== "" && lastTurn?.black !== "" ) {
                state.history = [...oldHistory, lastTurn, {turn: lastTurn?.turn + 1, white: shortMoveToString(payload.newMove), black: ""}];
            }
            if (lastTurn?.white === "") {
                state.history = [...oldHistory, {turn: lastTurn?.turn, white: shortMoveToString(payload.newMove), black: ""}];
                return;
            }
            if (lastTurn?.black === "") {
                state.history = [...oldHistory, {turn: lastTurn?.turn, white: lastTurn?.white, black: shortMoveToString(payload.newMove)}];
                return;
            }
        },
        setHistory: (state, { payload }: PayloadAction<{ newHistory: Array<TurnHistory> }>) => {
            state.history = payload.newHistory;
        },
        clearHistory: state => {
            state.history = [];
        }
    }
})

export const selectHistory = (state: RootState) => state.history.history;

export const { addMoveToHistory, setHistory, clearHistory } = historySlice.actions;
export default historySlice;