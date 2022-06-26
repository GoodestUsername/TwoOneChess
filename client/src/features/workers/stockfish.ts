import { Move, ShortMove } from "chess.js";
import { shortMoveToString } from "features/engine/chessEngine";
export type CalculatedMove = {
    move: ShortMove
    cp: number
}

class UciEngineWorker {
    worker: Worker | undefined;
    moves: CalculatedMove[] = []
    resolver: (({calcMoves, bestMove}: {calcMoves: CalculatedMove[], bestMove: ShortMove}) => void) | null 

    constructor(file: string) {
        try {
            this.worker = new Worker(file);
            this.worker.addEventListener("error", (error) => {
                // put in actual fix later cant find solution
                window.location.reload();
            }, false)
        }

        catch {
            // put in actual fix later cant find solution
            this.worker = undefined;
            window.location.reload();
        }
        this.moves = [];
        this.resolver = null;

        const _self = this;
        
        this.worker!.postMessage('uci');
        this.worker!.addEventListener('message', function (e) {  
            const best  = e.data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            const move  = e.data.match(/pv ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            const cp    = e.data.match(/cp ([0-9]+)?/);
            if (move) {
                _self.moves.push({move: {from: move[1], to: move[2], promotion: move[3]}, cp: parseInt(cp[1])})
            }
            if (best && _self.resolver) {
                const bestMove: ShortMove = { from: best[1], to: best[2], promotion: best[3]}
                _self.resolver({calcMoves:_self.moves, bestMove: bestMove});
                _self.resolver = null;
                _self.moves = [];
            }
            });
    }

    getMoves(history: Move[]) {
        return new Promise((resolve, reject) => {
            if (this.resolver) {
                reject('Pending move is present');
                return;
            }
            if (this.worker === undefined) {
                reject('No worker is present');
                return;
            }
            this.resolver = resolve;
            this.worker.postMessage('setoption name MultiPV value 3');
            const moveHistory = history.map((move) => {return shortMoveToString(move)})
            const positionMessage = `position startpos moves ${moveHistory.join(" ")}`
            this.worker.postMessage(positionMessage);
            this.worker.postMessage('go movetime 1000');
        })
    }
}

export default UciEngineWorker;