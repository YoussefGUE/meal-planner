import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Recipes from './pages/Recipes';
import Explore from './pages/Explore';
import Planner from './pages/Planner';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={token ? <Recipes /> : <Navigate to="/login" />} />
          <Route path="/explore" element={token ? <Explore /> : <Navigate to="/login" />} />
          <Route path="/planner" element={token ? <Planner /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
