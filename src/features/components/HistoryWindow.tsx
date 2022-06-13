import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

import { shortMoveToString } from "features/engine/chessEngine";
import { Move } from "chess.js";

// hooks
import { useRef, useEffect } from "react";

import "styling/scss/historywindow.scss"
import { useMediaQuery } from "react-responsive";

interface Column {
    id: 'turn' | 'white' | 'black',
    label: string,
    minWidth?: number,
    background?: string
}

const columns: readonly Column[] = [
    { id: 'turn',  label: 'Turn',  minWidth: 66, background: "secondary" },
    { id: 'white', label: 'White', minWidth: 66, background: "primary.main" },
    { id: 'black', label: 'Black', minWidth: 66, background: "primary.main" },
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

const useStyles = makeStyles((theme: Theme) => ({
    headerCell: {
        backgroundColor: theme.palette.secondary.main,
    }, 
}))

interface HistoryCardInterface {
    history: Array<TurnHistory>;
}

const HistoryCard: React.FC<HistoryCardInterface> = ({ history }) => {
    const lastMoveInHistoryRef = useRef<any>(null);
    const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' })
    const classes = useStyles()
    
    useEffect(() => {
        if (isDesktop) lastMoveInHistoryRef.current?.scrollIntoView();
    }, [history, isDesktop]);

    return (
        <Paper className="historyWindow" sx={{ overflow: 'auto' }}>
            <TableContainer sx={{ height: 560 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    className={classes.headerCell}
                                    align="center"
                                    sx={{ minWidth: column.minWidth }}>
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
                                            <TableCell key={turn.turn + column.id} align="center">
                                                { cellValue }
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                        })}
                        {/* <TableRow sx={{display: "none"}} ref={lastMoveInHistoryRef} key="ref" /> */}
                        <TableRow sx={{opacity: "0%"}} key="ref">
                            <TableCell color="secondary">
                                <div ref={lastMoveInHistoryRef} key="ref"></div>               
                            </TableCell>

                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default HistoryCard;