import { Paper, Container, Box } from "@mui/material";
import DocumentSection from "./DocumentSection";

interface DocumentInterface {
    title : string,
    children: React.ReactNode
}

const Document: React.FC<DocumentInterface> = ({title, children}) => {
    return (
      <Paper color="secondary" elevation={9}>
        <Container sx={{
            marginTop: "2vh",
            height: '98vh',
            minWidth: "320px",
            overflowY: "auto",
            width:"40rem"
          }}>
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
  