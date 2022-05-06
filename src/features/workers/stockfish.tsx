import { ShortMove } from "chess.js";
export type CalculatedMove = {
    move: ShortMove
    cp: number
}

class UciEngineWorker {
    worker: Worker;
    moves: CalculatedMove[] = []
    moveHistory: string;
    resolver: ((value: CalculatedMove[]) => void) | null 

    constructor(file: string) {
        this.worker = new Worker(file);
        this.moveHistory = "";
        this.moves = [];
        this.resolver = null;

        let _self = this;
        
        this.worker.postMessage('uci');
        this.worker.addEventListener('message', function (e) {  
            let best  = e.data.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            let move  = e.data.match(/pv ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            let cp    = e.data.match(/cp ([0-9]+)?/);
          if (move) {
              _self.moves.push({move: {from: move[1], to: move[2]}, cp: parseInt(cp[1])})
          }
          if (best && _self.resolver) {
            _self.resolver(_self.moves);
            _self.resolver = null;
            _self.moves = [];
          }
          });
    }

    async getMoves() {
        //  this.worker.postMessage('uci');
        //  this.worker.postMessage(`position fen ${game.fen()}`);
        //  this.worker.postMessage('setoption name Skill Level value 0');
        //  this.worker.postMessage('setoption name Use NNUE value true');
        //  this.worker.postMessage('go depth 10');
        return new Promise((resolve, reject) => {
            if (this.resolver) {
                reject('Pending move is present');
                return;
              }
            this.resolver = resolve;
            this.worker.postMessage('setoption name MultiPV value 3');
            // this.worker.postMessage('setoption name Use NNUE value true');
            this.worker.postMessage(`position startpos moves`);
            //  this.worker.postMessage('eval');
            //  this.worker.postMessage('position startpos moves' + game.moves());
            this.worker.postMessage('go movetime 1000');
        })

    }
}

export default UciEngineWorker;