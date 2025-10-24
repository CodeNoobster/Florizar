import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './Topbar.css';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="topbar">
      <div className="topbar-content">
        <div className="topbar-left">
          {/* Espace pour le titre de page ou breadcrumbs */}
        </div>

        <div className="topbar-right">
          <div className="topbar-user">
            <span className="topbar-username">{user.username}</span>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
