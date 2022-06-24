import React, { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Divider } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface ConfirmationButtonInterface {
    onClickInitial: Function,
    onClickConfirm: Function,
    onClickCancel: Function,
    isBtnDisabled: Function,
    fstBtnoffByDef: boolean,
    buttonText: string,
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
}
const ConfirmButton: React.FC<ConfirmationButtonInterface> = ({
    onClickInitial,
    onClickConfirm,
    onClickCancel,
    isBtnDisabled,
    fstBtnoffByDef,
    buttonText,
    confirmText}) => {
    const [clickedInitial, setClickedInitial] = useState(false);
    const [disableInitial, setDisableInitial] = useState(fstBtnoffByDef);
    const [btnText, setBtnText] = useState<string>("");

    useEffect(() => {
        setBtnText(buttonText);
        isBtnDisabled(setDisableInitial);
        if (!isBtnDisabled) {
            setClickedInitial(false);
        }
    }, [buttonText, isBtnDisabled])

    return (
        <>
        {clickedInitial && (<ButtonGroup
                                style={{height: "4rem", width: "33%"}}
                                fullWidth={true}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    sx={confirmButtonStyling}
                                    onClick={() => {
                                        onClickConfirm();
                                        setClickedInitial(false);} }> {confirmText ? confirmText : <CheckIcon fontSize="large" />} </Button>
                                <Divider sx={{ borderRightWidth: 1, minHeight: "4rem", zIndex:100 }} orientation="vertical" flexItem={true}/>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary" 
                                    sx={confirmButtonStyling}
                                    onClick={() => {
                                        onClickCancel() ;
                                        setClickedInitial(false);} }><ClearIcon fontSize="large"/></Button>
                            </ButtonGroup>)
        }
        {!clickedInitial && 
        <Box sx={{width: "33.33%"}}>
            <LoadingButton
                loading={disableInitial}
                loadingPosition="center"
                variant="contained"
                color="secondary"
                loadingIndicator={<MoreHorizIcon/>}
                sx={{...buttonStyling, fontSize: "1.2rem"}}
                onClick={() => {
                    onClickInitial();
                    setClickedInitial(true)
                }}> {btnText}</LoadingButton>
        </Box>
        }
        </>
    )
};
export default ConfirmButton;
