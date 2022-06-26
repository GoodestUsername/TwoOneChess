// components
import { Box } from "@mui/material";
import Document from "features/components/DocumentComponent";
import DocumentSection from "features/components/DocumentSection";

// images
import featureImageLoadingButtons from "assets/images/LoadingButtons.png"
import featureImageMoveButtons from "assets/images/MoveButtons.png"
import featureImageMovePreview from "assets/images/MovePreview.png"

const FeaturesPage = () => {
  return (
    <div className="FeaturesPage">
      <Document 
        title={"Two-One Chess Features"} >
        <DocumentSection title={"Engine Moves!"} titleVariant={"h6"}>
          Do you suck at Chess? Do you wish you had stockfish right in front of you?
          Dont worry you have a 66% chance of using a stockfish move!
          And a 33% chance of getting a stupidfish move...
          {<br/>}
          You can also do your OWN move, if you think your smarter than stockfish!
        </DocumentSection>
        <DocumentSection title={"When its your turn, stockfish will generate moves for you!"} titleVariant={"h6"}>
          <Box
              component="img"
              sx={{width: "100%"}}
              alt="generated moves"
              src={featureImageMoveButtons}/>
        </DocumentSection>
        <DocumentSection title={"When its your opponents turn, stockfish will be on standby!"} titleVariant={"h6"}>
          <Box
              component="img"
              sx={{width: "100%"}}
              alt="loading buttons"
              src={featureImageLoadingButtons}/>
        </DocumentSection>
        <DocumentSection title={"When you click on a move it will show you an arrow of where the piece will go. Allowing you to confirm or cancel the selected move!"} titleVariant={"h6"}>
          <Box
              component="img"
              sx={{width: "100%"}}
              alt="Move preview"
              src={featureImageMovePreview}/>
        </DocumentSection>
      </Document>
    </div>
  );
}

export default FeaturesPage;
