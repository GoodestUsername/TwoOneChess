import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// styles
import 'bootstrap/dist/css/bootstrap.css';
import GamePage from 'pages/game/GamePage';
import Layout from 'features/layout/Layout';
import NotFoundPage from 'pages/404/NotFoundPage';

// import './scss/index.css'
// icons
// import 'utils/fontawesome';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={< Layout/>}>
            <Route path="*"       element={ <NotFoundPage/> }/>
            <Route path="/"       element={ <GamePage/> }/>
            <Route path=":roomId" element={ <GamePage/> }/>
          </Route>
        </Routes>
    </BrowserRouter>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
