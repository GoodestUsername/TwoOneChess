import { MoveWithAssignment, shortMoveToString } from "features/engine/chessEngine";
import ConfirmButton from "../confirmButton";

interface PreviewConfirmButtonProps {
    botMove:MoveWithAssignment,
    setBotMovePreviews: Function,
    handleMove: Function
}

const PreviewConfirmButton: React.FC<PreviewConfirmButtonProps> = ({
    botMove, setBotMovePreviews, handleMove}) => {
    return(
        <ConfirmButton
            defaultText    = { "Calculating" }
            confirmText    = { "Confirm" }
            buttonText     = { shortMoveToString(botMove?.move) }
            fstBtnoffByDef = {true}
            isBtnDisabled  = { (disabledSetter: Function) => {disabledSetter(botMove === null)}}
            onClickInitial = { () => { if (botMove !== null) {
                setBotMovePreviews((oldArray: string[][]) => 
                    [...oldArray, [botMove.move.from, botMove.move.to]])
                }}}
            onClickConfirm = { () => { if (botMove?.move) {
                handleMove(botMove?.move);
                setBotMovePreviews([]);
            }}}
            onClickCancel  = { () => { if (botMove !== null) {
                setBotMovePreviews((oldArray: string[][]) => 
                    [...oldArray.filter((item, _) => item === [botMove.move.from, botMove.move.to])])
                }}}
        />
    )
}

export default PreviewConfirmButton;