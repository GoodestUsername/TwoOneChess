import { MoveWithAssignment, shortMoveToString } from "features/engine/chessEngine";
import { arraysEqual } from "util/helpers";
import ConfirmButton from "../ConfirmButton";

interface PreviewConfirmButtonProps {
    botMove:MoveWithAssignment,
    setBotMovePreviews: Function,
    handleMove: Function
}

const PreviewConfirmButton: React.FC<PreviewConfirmButtonProps> = ({
    botMove, handleMove, setBotMovePreviews}) => {
    return(
        <ConfirmButton
            buttonText       = { shortMoveToString(botMove?.move) }
            confirmText      = { null }
            fstBtnoffByDef   = { true }
            setIsBtnDisabled = { (disabledSetter: Function) => { disabledSetter(botMove === null) }}
            onClickInitial   = { () => { if (botMove !== null) {
                try {
                    setBotMovePreviews((oldArray: string[][]) => 
                        [...oldArray, [botMove.move.from, botMove.move.to]])
                    }
                catch (e){

                }
            }}}
            onClickConfirm = { () => { if (botMove?.move) {
                handleMove(botMove?.move);
                setBotMovePreviews([]);
            }}}
            onClickCancel  = { () => { if (botMove !== null) {
                try {
                    setBotMovePreviews((oldArray: string[][]) => 
                    [...oldArray.filter((item, _) => !arraysEqual(item, [botMove.move.from, botMove.move.to]))])
                }
                catch (e){
                    
                }
            }}}
        />
    )
}

export default PreviewConfirmButton;