import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Datatable from './datatable';
import Home from './home';



function App() {
  return (
    <div className="App">
       <BrowserRouter>
        <Routes>
          <Route path='/' exact Component={Home} />
          <Route path='/datatable' exact Component={Datatable} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
