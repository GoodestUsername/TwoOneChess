import { Paper, Container, Box } from "@mui/material";
import DocumentSection from "./DocumentSection";

// hooks
import useWindowDimensions from "./hooks/useWindowDimensions";
import { useMediaQuery } from "react-responsive";

interface DocumentInterface {
    title : string,
    children: React.ReactNode
}

const Document: React.FC<DocumentInterface> = ({title, children}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const { width } = useWindowDimensions();
    return (
      <Paper color="secondary" elevation={9}>
        <Container sx={{
            marginTop: "2vh",
            height: '98vh',
            overflowY: "auto",
            width: isMobile ? width : "560px"
          }}>
          <Box p={2} sx={{}}>
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
  