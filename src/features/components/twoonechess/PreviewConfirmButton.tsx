import { MoveWithAssignment, shortMoveToString } from "features/engine/chessEngine";
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
            buttonText     = { shortMoveToString(botMove?.move) }
            confirmText    = { null }
            fstBtnoffByDef = { true }
            isBtnDisabled  = { (disabledSetter: Function) => {disabledSetter(botMove === null)}}
            onClickInitial = { () => { if (botMove !== null) {
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
                        [...oldArray.filter((item, _) => item === [botMove.move.from, botMove.move.to])])
                    }
                    catch (e){
                        
                    }
            }}}
        />
    )
}

export default PreviewConfirmButton;