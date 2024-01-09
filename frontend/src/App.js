import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Datatable from './datatable';
import Home from './home';
import ProfilePage from './ProfilePage';
import { Auth0Provider } from '@auth0/auth0-react';



function App() {
  return (
    <div className="App">
      <Auth0Provider
        domain="dev-dquphuv3kserjv4g.us.auth0.com"
        clientId="8LE38Iar5B9uRNQhLfzQWbbSwtMCrcig"
        redirectUri={window.location.origin}
        useRefreshTokens={true}
        cacheLocation="localstorage"
      >
       <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/datatable' element={<Datatable/>} />
          <Route path='/profile' element={<ProfilePage/>} />
        </Routes>
      </BrowserRouter>
      </Auth0Provider>
    </div>
  );
}

export default App;
