// Components
import GamePage from "pages/game/GamePage";

// context
import { SocketContext, socket } from "context/socketContext";

const App = () => {
  return (
    <div className="App" style={{background: "#000000", color: "#d3d3d3"}}>
      <SocketContext.Provider value={socket}>
        <GamePage/>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
