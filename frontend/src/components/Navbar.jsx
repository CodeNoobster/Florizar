import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          🌿 Florizar
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/chantiers" className="navbar-link">
              Chantiers
            </Link>
          </li>
          <li>
            <Link to="/clients" className="navbar-link">
              Clients
            </Link>
          </li>
        </ul>

        <div className="navbar-user">
          <span className="user-name">{user.username}</span>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
