import { Paper, Container, Box, Typography } from "@mui/material";

interface DocumentInterface {
    title : string,
    children: React.ReactNode
}

const Document: React.FC<DocumentInterface> = ({title, children}) => {
    return (
      <div className="PlannedPage">
        <Paper>
          <Container sx={{height: '90vh', minWidth: "320px", width:"30em"}}>
            <Box pt={2}>
              <Typography pb={2} textAlign={"center"} variant="h5">{title}</Typography>
              {children}
            </Box>
          </Container>
        </Paper>
      </div>
    );
  }
  
  export default Document;
  