import React from "react";

interface ConfirmationButtonInterface {
    onClickEvent: Function,
    buttonText: string,
    submissionValue: any
    defaultText: string
}

// class ConfirmButton extends React.Component<ConfirmationButtonInterface> {
// class ConfirmButton extends React.Component {
    // constructor(props: any) {
    //     super(props);
    //     this.handleClick = this.handleClick.bind(this);
    // }
const ConfirmButton: React.FC<ConfirmationButtonInterface> = ({
    onClickEvent,
    buttonText,
    submissionValue,
    defaultText}) => {
    return (
        <>
            <button
                onClick={() => {onClickEvent(submissionValue)}}
            >{buttonText|| defaultText} </button>
        </>
    )
};
// pass text to initial button from higher state

// change state for switching to confirmation button
// pass handle click for confirmation button from higher state
// pass actual button to reveal

export default ConfirmButton;
