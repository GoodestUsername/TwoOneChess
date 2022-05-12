import React, { useEffect, useState } from "react";

interface ConfirmationButtonInterface {
    onClickInitial: Function,
    onClickConfirm: Function,
    onClickCancel: Function,
    isBtnDisabled: Function,
    buttonText: string,
    defaultText: string
}

const ConfirmButton: React.FC<ConfirmationButtonInterface> = ({
    onClickInitial,
    onClickConfirm,
    onClickCancel,
    isBtnDisabled,
    buttonText,
    defaultText}) => {
    const [clickedInitial, setClickedInitial] = useState(false);
    const [disableInitial, setDisableInitial] = useState(false);
    const [btnText, setBtnText] = useState(defaultText);

    useEffect(() => {
        setBtnText(buttonText || defaultText);
        isBtnDisabled(setDisableInitial)
    }, [buttonText, defaultText, isBtnDisabled])

    return (
        <>
        {clickedInitial && (<><button onClick={() => {
                                onClickConfirm();
                                setClickedInitial(false);} }> {"buttonText|| defaultText Confirm"}
                            </button>
                            <button onClick={onClickCancel()}>Cancel</button></>
        )

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
