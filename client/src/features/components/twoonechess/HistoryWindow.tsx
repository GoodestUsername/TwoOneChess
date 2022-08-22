import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";

// redux
import { selectHistory, TurnHistory } from "features/components/twoonechess/historySlice";

// hooks
import { useRef, useEffect } from "react";

import "styling/scss/historywindow.scss"
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";

interface Column {
    id: 'turn' | 'white' | 'black',
    label: string,
    minWidth?: number,
    padding?: number | string,
    backgroundColor: string,
    border?: string
}

const columns: readonly Column[] = [
    { id: 'turn',  label: 'Turn',  minWidth: 48, padding: "6px", backgroundColor: "secondary.light"},
    { id: 'white', label: 'White', minWidth: 66, padding: "6px", backgroundColor: "secondary.light"},
    { id: 'black', label: 'Black', minWidth: 66, padding: "6px", backgroundColor: "secondary.light"},
];

const useStyles = makeStyles((theme: Theme) => ({
    headerCell: {
        backgroundColor: theme.palette.secondary.main,
    }
}))

/**
 * history table component
 * @returns HistoryCard component
 */
const HistoryCard = () => {
    const lastMoveInHistoryRef = useRef<any>(null);
    const isDesktop = useMediaQuery({ query: '(min-width: 769px)' })
    const classes = useStyles()

    const history = useSelector(selectHistory)
    
    useEffect(() => {
        // everytime history changes, scroll the table to the last move made
        if (isDesktop) lastMoveInHistoryRef.current?.scrollIntoView();
    }, [history, isDesktop]);

    return (
        <Paper className="historyWindow">
            <TableContainer sx={{ height: "100%", overflowX: 'hidden' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {/* create header columns */}
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    className={classes.headerCell}
                                    align="center"
                                    sx={{ minWidth: column.minWidth, padding: column.padding, backgroundColor: column.backgroundColor }}>
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* creates turn history table rows */}
                        {history.map((turn: TurnHistory, i: number) => {
                            // check if it is the last item(turn) in the array
                            const isLastTurn = !history[i + 1];

                            return(
                                <TableRow key={turn.turn}>
                                    {columns.map((column) => {
                                        const cellValue = turn[column.id];
                                        let isLastMove = false;
                                        if (isLastTurn) {
                                            // last move can only be black if black contains a move,
                                            // it can only be white if black is empty, since white moves before black
                                            isLastMove = ((column.id === 'black' && turn.black !== "") ||
                                                        (column.id === 'white' && turn.black === ""))
                                        }
                                        // last move is highlighted in sx
                                        return(
                                            <TableCell key={turn.turn + column.id} align="center"
                                                sx={{background: isLastMove ? "grey": null}} >
                                                { cellValue }
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                        })}
                        <TableRow sx={{opacity: "0%"}} key="ref">
                            <TableCell sx={{padding: "0px"}} color="secondary">
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