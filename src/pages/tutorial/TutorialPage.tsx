// components
import { Box } from "@mui/material";
import Document from "features/components/DocumentComponent";
import DocumentSection from "features/components/DocumentSection";

// images
import redCircleInviteLinkBtn from "assets/images/FullScreenCirclingInviteBtn.png";
import redCircleCopyLink from "assets/images/InviteScreenModal.png";
import MoveButtonsScreen from "assets/images/MoveButtonsScreen.png";
import ManualMoveBoard from "assets/images/ManualMoveBoard.png";
import MovePreviewScreen from "assets/images/MovePreviewScreen.png";

const FeaturesPage = () => {
  return (
    <div className="FeaturesPage">
      <Document 
        title={"Two-One Chess Tutorial!"} >
        <DocumentSection title={"Step 1: Create a game"} titleVariant={"h6"}>
          Press the "Create Invite Link" button to receive an invite link to a game.
          <Box
              component="img"
              sx={{width: "100%"}}
              alt="Press invite link button"
              src={redCircleInviteLinkBtn}/>
        </DocumentSection>
        <DocumentSection title={"Step 2: Copy and send Invite Link!"} titleVariant={"h6"}>
          Copy the invite link with the copy button, or select it yourself to copy. And send it someone else!
          <Box
              component="img"
              sx={{width: "100%"}}
              alt="Invite link pop up"
              src={redCircleCopyLink}/>
        </DocumentSection>
        <DocumentSection title={"Step 3: Starting the game!"} titleVariant={"h6"}>
          When your opponent opens the invite link in their browswer, both of you will automatically be placed into a game!
          {<br/>}
          You will always be the player on the bottom of the screen!
          <Box
              component="img"
              sx={{width: "100%"}}
              alt="White turn game screen"
              src={MoveButtonsScreen}/>
        </DocumentSection>
        <DocumentSection title={"Step 4: Playing the game!"} titleVariant={"h6"}>
            When its your turn you can make your own move, or pick one of the engine moves on the bottom of the board.
            {<br/>}
            But be warned, one of them is the worst move!
          <Box
              component="img"
              sx={{width: "100%"}}
              alt="Manual move"
              src={ManualMoveBoard}/>
        <Box
            component="img"
            sx={{width: "100%"}}
            alt="Engine move preview"
            src={MovePreviewScreen}/>
        </DocumentSection>
      </Document>
    </div>
  );
}

export default FeaturesPage;
