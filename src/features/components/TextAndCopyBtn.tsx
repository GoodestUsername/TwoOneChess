import { useState } from "react";
import { Grid, Box, Typography, Tooltip, IconButton } from "@mui/material";

// Icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface TextAndCopyBtnInterface {
    toCopyText: string,
}
const TextAndCopyBtn:React.FC<TextAndCopyBtnInterface> = ({toCopyText}) =>{
    const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

    const handleOpenTooltip = () => {
        setIsTooltipOpen(true);
    }
    const handleCloseTooltip = () => {
        setIsTooltipOpen(false);
    }

    return (
        <Grid direction="row" alignItems="center" container>
            <Grid item xs={true} >
                <Box sx={{border: "1px", borderColor: "info", borderStyle: "solid", padding:"2px 4px"}}>
                    <Typography>
                        {toCopyText}
                    </Typography>
                </Box>
            </Grid>
            <Grid item>
                <Tooltip 
                open={isTooltipOpen} 
                title="Copied to clipboard!" 
                leaveDelay={2000} 
                onClose={handleCloseTooltip}>
                    <IconButton onClick={() => {
                        navigator.clipboard.writeText(toCopyText);
                        handleOpenTooltip()
                        }} aria-label="Copy">
                        <ContentCopyIcon color="info" />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    )
}
export default TextAndCopyBtn;
