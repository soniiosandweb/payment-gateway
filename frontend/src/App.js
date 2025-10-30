import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './Layout';
import Home from './Home';
import Response from './Response';

function App() {
  return(
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/response/:id" element={<Response />} />
          </Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App;
