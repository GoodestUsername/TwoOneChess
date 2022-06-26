import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// styles
import 'bootstrap/dist/css/bootstrap.css';
import GamePage from 'pages/game/GamePage';
import Layout from 'features/layout/Layout';
import NotFoundPage from 'pages/404/NotFoundPage';
import PlannedPage from 'pages/planned/PlannedPage';
import FeaturesPage from 'pages/features/FeaturesPage';
import AboutMePage from 'pages/about/AboutMePage';
import TutorialPage from 'pages/tutorial/TutorialPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={< Layout/>}>
            <Route path="*"         element={ <NotFoundPage/> }/>
            <Route path="/"         element={ <GamePage/> }/>
            <Route path="/tutorial" element={ <TutorialPage/> }/>
            <Route path="/features" element={ <FeaturesPage/> }/>
            <Route path="/planned"  element={ <PlannedPage/> }/>
            <Route path="/about"    element={ <AboutMePage/> }/>
            <Route path="/:roomId"  element={ <GamePage/> }/>
          </Route>
        </Routes>
    </BrowserRouter>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
