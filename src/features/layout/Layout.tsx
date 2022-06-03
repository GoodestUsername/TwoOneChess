import { SocketContext, socket } from "context/socketContext";
import { CookiesProvider } from "react-cookie";
import { Outlet } from "react-router-dom";

// Components
const Layout = () => {
  return (
    <div className="App" style={{background: "#000000", color: "#d3d3d3"}}>
      <SocketContext.Provider value={socket}>
        <CookiesProvider>
          <Outlet/>
        </CookiesProvider>
      </SocketContext.Provider>
    </div>
  );
}

export default Layout;
