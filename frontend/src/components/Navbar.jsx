import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">膳 MealPlanner</Link>
      <ul className="navbar-links">
        <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Accueil</Link></li>
        {token && (
          <>
            <li><Link to="/recipes" className={location.pathname === '/recipes' ? 'active' : ''}>Recettes</Link></li>
            <li><Link to="/explore" className={location.pathname === '/explore' ? 'active' : ''}>Explorer</Link></li>
            <li><Link to="/planner" className={location.pathname === '/planner' ? 'active' : ''}>Planificateur</Link></li>
          </>
        )}
      </ul>
      {token ? (
        <button onClick={handleLogout} className="btn-logout">Déconnexion</button>
      ) : (
        <Link to="/login" className="btn-nav">Connexion</Link>
      )}
    </nav>
  );
}

export default Navbar;
