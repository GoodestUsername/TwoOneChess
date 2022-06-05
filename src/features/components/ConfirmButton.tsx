import React, { useEffect, useState } from "react";
import { Box, Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
interface ConfirmationButtonInterface {
    onClickInitial: Function,
    onClickConfirm: Function,
    onClickCancel: Function,
    isBtnDisabled: Function,
    fstBtnoffByDef: boolean,
    buttonText: string,
    defaultText: string,
    confirmText: string | null
}
const buttonStyling = {
    fontWeight: "bold",
    borderRadius: 0,
    minHeight: "100%"
}

const confirmButtonStyling = {
    ...buttonStyling,
    fontSize: "1.5rem",
    width: "50%",
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
        isBtnDisabled(setDisableInitial);
        if (!isBtnDisabled) {
            setClickedInitial(false);
        }
    }, [buttonText, defaultText, isBtnDisabled])

    return (
        <>
        {clickedInitial && (<Box sx={{width: "33.33%"}}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={confirmButtonStyling}
                                    onClick={() => {
                                        onClickConfirm();
                                        setClickedInitial(false);} }> {confirmText ? confirmText : <CheckIcon fontSize="large" />} </Button>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary" 
                                    sx={confirmButtonStyling}
                                    onClick={() => {
                                        onClickCancel() ;
                                        setClickedInitial(false);} }><ClearIcon fontSize="large"/></Button>
                            </Box>)
        }
        {!clickedInitial && 
        <Box sx={{width: "33.33%"}}>
            <Button 
                disabled={disableInitial}
                variant="contained"
                color="secondary"
                sx={{...buttonStyling, fontSize: "1.2rem"}}
                onClick={() => {
                    onClickInitial();
                    setClickedInitial(true)
                }}>{btnText}</Button>
        </Box>
        }
        </>
    )
};
export default ConfirmButton;
