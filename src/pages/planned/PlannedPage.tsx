import { Paper, Container, Box, Typography } from "@mui/material";
import Document from "features/components/DocumentComponent";

const PlannedPage = () => {
  return (
    <div className="PlannedPage">
      <Document title={"Planned Features"}>
        <Typography>
          Add opponent chat

          Add surrender / request stalemate button

          Add timer

          User Accounts - for game history and ranked / elo
        </Typography>
      </Document>
    </div>
  );
}

export default PlannedPage;
