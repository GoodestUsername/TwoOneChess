import { Paper, Container, Box } from "@mui/material";
import DocumentSection from "./DocumentSection";

interface DocumentInterface {
    title : string,
    children: React.ReactNode
}

const Document: React.FC<DocumentInterface> = ({title, children}) => {
    return (
      <Paper color="secondary" elevation={9}>
        <Container sx={{height: '95vh', minWidth: "320px", width:"40rem"}}>
          <Box p={2}>
            <DocumentSection 
              title={title} 
              titleStyle={{paddingBottom: 3, textAlign: "center"}}
              titleVariant="h4">
            </DocumentSection>
            {children}
          </Box>
        </Container>
      </Paper>
    );
  }
  
  export default Document;
  