import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    gestion: true,
    commercial: false,
    planning: false,
    parametres: false
  });
  const location = useLocation();
  const { user } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {collapsed ? '☰' : '✕'}
        </button>
        {!collapsed && (
          <Link to="/" className="sidebar-logo">
            <span className="logo-icon">🌿</span>
            <span className="logo-text">Florizar</span>
          </Link>
        )}
      </div>

      <nav className="sidebar-nav">
        {/* Dashboard */}
        <Link
          to="/"
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
          title="Tableau de bord"
        >
          <span className="nav-icon">📊</span>
          {!collapsed && <span className="nav-text">Tableau de bord</span>}
        </Link>

        {/* Section Gestion */}
        <div className="nav-section">
          <button
            className="nav-section-header"
            onClick={() => toggleSection('gestion')}
          >
            <span className="nav-icon">🏗️</span>
            {!collapsed && (
              <>
                <span className="nav-text">Gestion</span>
                <span className={`expand-icon ${expandedSections.gestion ? 'expanded' : ''}`}>
                  ▼
                </span>
              </>
            )}
          </button>

          {(expandedSections.gestion || collapsed) && (
            <div className="nav-submenu">
              <Link
                to="/clients"
                className={`nav-item submenu-item ${isActive('/clients') ? 'active' : ''}`}
                title="Clients"
              >
                <span className="nav-icon">👥</span>
                {!collapsed && <span className="nav-text">Clients</span>}
              </Link>

              <Link
                to="/chantiers"
                className={`nav-item submenu-item ${isActive('/chantiers') ? 'active' : ''}`}
                title="Chantiers"
              >
                <span className="nav-icon">🏗️</span>
                {!collapsed && <span className="nav-text">Chantiers</span>}
              </Link>
            </div>
          )}
        </div>

        {/* Section Commercial (à venir) */}
        <div className="nav-section">
          <button
            className="nav-section-header"
            onClick={() => toggleSection('commercial')}
          >
            <span className="nav-icon">💼</span>
            {!collapsed && (
              <>
                <span className="nav-text">Commercial</span>
                <span className={`expand-icon ${expandedSections.commercial ? 'expanded' : ''}`}>
                  ▼
                </span>
              </>
            )}
          </button>

          {(expandedSections.commercial || collapsed) && (
            <div className="nav-submenu">
              <div className="nav-item submenu-item disabled" title="Devis (à venir)">
                <span className="nav-icon">📝</span>
                {!collapsed && <span className="nav-text">Devis <span className="badge-soon">Bientôt</span></span>}
              </div>

              <div className="nav-item submenu-item disabled" title="Factures (à venir)">
                <span className="nav-icon">💰</span>
                {!collapsed && <span className="nav-text">Factures <span className="badge-soon">Bientôt</span></span>}
              </div>
            </div>
          )}
        </div>

        {/* Section Planning (à venir) */}
        <div className="nav-section">
          <button
            className="nav-section-header"
            onClick={() => toggleSection('planning')}
          >
            <span className="nav-icon">📅</span>
            {!collapsed && (
              <>
                <span className="nav-text">Planning</span>
                <span className={`expand-icon ${expandedSections.planning ? 'expanded' : ''}`}>
                  ▼
                </span>
              </>
            )}
          </button>

          {(expandedSections.planning || collapsed) && (
            <div className="nav-submenu">
              <div className="nav-item submenu-item disabled" title="Calendrier (à venir)">
                <span className="nav-icon">📆</span>
                {!collapsed && <span className="nav-text">Calendrier <span className="badge-soon">Bientôt</span></span>}
              </div>

              <div className="nav-item submenu-item disabled" title="Équipements (à venir)">
                <span className="nav-icon">🚜</span>
                {!collapsed && <span className="nav-text">Équipements <span className="badge-soon">Bientôt</span></span>}
              </div>
            </div>
          )}
        </div>

        {/* Section Paramètres (à venir) */}
        <div className="nav-section">
          <button
            className="nav-section-header"
            onClick={() => toggleSection('parametres')}
          >
            <span className="nav-icon">⚙️</span>
            {!collapsed && (
              <>
                <span className="nav-text">Paramètres</span>
                <span className={`expand-icon ${expandedSections.parametres ? 'expanded' : ''}`}>
                  ▼
                </span>
              </>
            )}
          </button>

          {(expandedSections.parametres || collapsed) && (
            <div className="nav-submenu">
              <div className="nav-item submenu-item disabled" title="Profil (à venir)">
                <span className="nav-icon">👤</span>
                {!collapsed && <span className="nav-text">Mon profil <span className="badge-soon">Bientôt</span></span>}
              </div>

              <div className="nav-item submenu-item disabled" title="Configuration (à venir)">
                <span className="nav-icon">🔧</span>
                {!collapsed && <span className="nav-text">Configuration <span className="badge-soon">Bientôt</span></span>}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Footer de la sidebar */}
      {!collapsed && (
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user.username.charAt(0).toUpperCase()}</div>
            <div className="user-details">
              <div className="user-name">{user.username}</div>
              <div className="user-email">{user.email}</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
