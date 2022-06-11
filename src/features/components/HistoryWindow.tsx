import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Move } from "chess.js";
import { shortMoveToString } from "features/engine/chessEngine";
import { useRef, useEffect } from "react";

interface Column {
    id: 'turn' | 'white' | 'black',
    label: string,
    minWidth?: number
}

const columns: readonly Column[] = [
    { id: 'turn', label: 'Turn', minWidth: 100 },
    { id: 'white', label: 'White', minWidth: 100 },
    { id: 'black', label: 'Black', minWidth: 100 },
];

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

interface HistoryCardInterface {
    history: Array<TurnHistory>;
}

const HistoryCard: React.FC<HistoryCardInterface> = ({ history }) => {
    const lastMoveInHistoryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        lastMoveInHistoryRef.current?.scrollIntoView();
        history.forEach(element => {
            console.log(element)
        })
    }, [history]);

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table>
                    <TableHead style={{color: "white"}}>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    style={{ minWidth: column.minWidth, color: "white" }}
                                    >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.map((turn) => {
                            return(
                                <TableRow key={turn.turn}>
                                    {columns.map((column) => {
                                        const cellValue = turn[column.id];
                                        return(
                                            <TableCell key={turn.turn + column.id} sx={{color: "white"}}>
                                                { cellValue }
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                        })}
                        {/* <div ref={lastMoveInHistoryRef} /> */}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default HistoryCard;