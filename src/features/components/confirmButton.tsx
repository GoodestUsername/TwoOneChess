import React, { useEffect, useState } from "react";

interface ConfirmationButtonInterface {
    onClickInitial: Function,
    onClickConfirm: Function,
    onClickCancel: Function,
    isBtnDisabled: Function,
    fstBtnoffByDef: boolean,
    buttonText: string,
    defaultText: string,
    confirmText: string
}

const ConfirmButton: React.FC<ConfirmationButtonInterface> = ({
    onClickInitial,
    onClickConfirm,
    onClickCancel,
    isBtnDisabled,
    fstBtnoffByDef,
    buttonText,
    defaultText,
    confirmText}) => {
    const [clickedInitial, setClickedInitial] = useState(false);
    const [disableInitial, setDisableInitial] = useState(fstBtnoffByDef);
    const [btnText, setBtnText] = useState(defaultText);

    useEffect(() => {
        setBtnText(buttonText || defaultText);
        isBtnDisabled(setDisableInitial)
    }, [buttonText, defaultText, isBtnDisabled])

    return (
        <>
        {clickedInitial && (<><button onClick={() => {
                                onClickConfirm();
                                setClickedInitial(false);} }> {confirmText}
                            </button>
                            <button onClick={() => {
                                onClickCancel() ;
                                setClickedInitial(false);} }>Cancel</button>
                            </>)
        }
        {!clickedInitial && 
            <button onClick={() => {
                onClickInitial();
                setClickedInitial(true)
                }} disabled={disableInitial}>
                {btnText}</button>
        }
        </>
    )
};
export default ConfirmButton;
