import { MoveWithAssignment, shortMoveToString } from "features/engine/chessEngine";
import { arraysEqual } from "util/helpers";
import ConfirmButton from "../ConfirmButton";

interface PreviewConfirmButtonProps {
    botMove:MoveWithAssignment,
    setBotMovePreviews: Function,
    handleMove: Function
}

/**
 *
 * @param {MoveWithAssignment} botMove { Bot move to set if the user clicks confirm }
 * @param {Function} handleMove { handles move when user clicks confirm}
 * @param {Function} setBotMovePreviews { setter for BotMovePreviews}
 * @returns Preview ConfirmButton component
 */
const PreviewConfirmButton: React.FC<PreviewConfirmButtonProps> = ({
    botMove, handleMove, setBotMovePreviews}) => {
    return(
        <ConfirmButton
            buttonText       = { shortMoveToString(botMove?.move) }
            confirmText      = { null }
            fstBtnoffByDef   = { true }
            setIsBtnDisabled = { (disabledSetter: Function) => { disabledSetter(botMove === null) }}
            // define initial click function and pass it, add the preview move to botmovepreviews
            onClickInitial   = { () => { if (botMove !== null) {
                try {
                    setBotMovePreviews((oldArray: string[][]) => 
                        [...oldArray, [botMove.move.from, botMove.move.to]])
                    }
                catch (e){

                }
            }}}
            // define click confirm function and pass it, function empties botmovepreviews and calls handleMove on the botMove
            onClickConfirm = { () => { if (botMove?.move) {
                handleMove(botMove?.move);
                setBotMovePreviews([]);
            }}}
            // define click cancel function and pass it, removes the premove attached from the inital click
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