import Document from "features/components/DocumentComponent";
import DocumentSection from "features/components/DocumentSection";

const PlannedPage = () => {
  return (
    <div className="PlannedPage">
      <Document 
        title={"Planned Features"} >
        <DocumentSection title={"Usernames"} titleVariant={"h5"}>
          Give yourself a unique and cool username!
        </DocumentSection>
        <DocumentSection title={"Game Chat"} titleVariant={"h5"}>
          Communicate and talk to your opponents!
        </DocumentSection>
        <DocumentSection title={"Game Over Button"} titleVariant={"h5"}>
          A surrender / request stalemate button for hopeless games!
        </DocumentSection>
        <DocumentSection title={"Turn Timers"} titleVariant={"h5"}>
          Limited time for each player so the game doesnt go on forever!
        </DocumentSection>
        <DocumentSection title={"Custom Configeration"} titleVariant={"h5"}>
          Change the parameters, like game timer, and who gets W/B player!
        </DocumentSection>
        <DocumentSection title={"Find Game"} titleVariant={"h5"}>
          Find a random player in random queue if there is anyone available!
        </DocumentSection>
        <DocumentSection title={"User Accounts"} titleVariant={"h5"}>
          User Accounts to save you username, match history and ranked / elo!
        </DocumentSection>
      </Document>
    </div>
  );
}

export default PlannedPage;
