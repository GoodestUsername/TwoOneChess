import React, { useState } from "react";

interface ConfirmationButtonInterface {
    onClickEvent: Function,
    buttonText: string,
    defaultText: string
}

const ConfirmButton: React.FC<ConfirmationButtonInterface> = ({
    onClickEvent,
    buttonText,
    defaultText}) => {
    const [clickedInitial, setClickedInitial] = useState(false); 
    return (
        <>
        {/* <button onClick={() => {onClickEvent(); setClickedInitial(true)}}>
                {buttonText|| defaultText}</button> */}
        {clickedInitial && 
            <button onClick={() => {onClickEvent(); setClickedInitial(false)}}>
                {buttonText|| defaultText}</button>
        }
        {!clickedInitial && 
            <button onClick={() => {onClickEvent(); setClickedInitial(true)}}>
                {buttonText|| defaultText}</button>
        }
        </>
    )
};
export default ConfirmButton;
