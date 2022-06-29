import { Box } from "@mui/system";
import { Modal, Typography } from "@mui/material";
import TextAndCopyBtn from "../TextAndCopyBtn";


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'primary.main',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

interface GameLinkModalInterface {
    isOpen: any,
    inviteLink: string,
    handleClose: Function,
}

const GameLinkModal: React.FC<GameLinkModalInterface> = ({
    isOpen,
    inviteLink,
    handleClose
    }) => {

    return (
        <Modal
            open={isOpen}
            onClose={() => {handleClose()}}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography variant="h5" textAlign="center">
                Invite Link
                </Typography>
                
                <TextAndCopyBtn toCopyText={inviteLink}></TextAndCopyBtn>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Send it to a friend or another person to play!
                </Typography>
            </Box>
        </Modal>
)};

export default GameLinkModal;