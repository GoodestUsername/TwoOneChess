import { Box, Typography } from "@mui/material";

interface DocumentSectionInterface {
    children: React.ReactNode,
    title : string,
    titleVariant: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6',
    titleStyle?: React.CSSProperties | undefined,
}

const DocumentSection: React.FC<DocumentSectionInterface> = (
    props
    ) => {
    return (
        <Box mt={2} mb={2}>
            <Typography
                sx={props.titleStyle}
                variant={props.titleVariant}
                gutterBottom>{props.title}
            </Typography>
            <Typography>
                {props.children} 
            </Typography>
        </Box>
    );
  }
  
  export default DocumentSection;
  