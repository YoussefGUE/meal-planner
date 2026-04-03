import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
{/*
import Recipes from './pages/Recipes';
import Explore from './pages/Explore';
import Planner from './pages/Planner';
import ShoppingList from './pages/ShoppingList';
import Navbar from './components/Navbar';
*/}
import './App.css';

function App() {
  const token = localStorage.getItem('token');

  return (
    <BrowserRouter>
      <div className="app">
        {token && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recipes" element={token ? <Recipes /> : <Navigate to="/login" />} />
          <Route path="/explore" element={token ? <Explore /> : <Navigate to="/login" />} />
          <Route path="/planner" element={token ? <Planner /> : <Navigate to="/login" />} />
          <Route path="/shopping" element={token ? <ShoppingList /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={token ? "/planner" : "/login"} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
