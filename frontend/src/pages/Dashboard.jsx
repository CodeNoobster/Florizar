import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chantiersAPI, clientsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalChantiers: 0,
    chantiersEnCours: 0,
    chantiersTermines: 0,
    totalClients: 0
  });
  const [recentChantiers, setRecentChantiers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [chantiersRes, clientsRes] = await Promise.all([
        chantiersAPI.getAll(),
        clientsAPI.getAll()
      ]);

      const chantiers = chantiersRes.data;
      const clients = clientsRes.data;

      setStats({
        totalChantiers: chantiers.length,
        chantiersEnCours: chantiers.filter(c => c.statut === 'en_cours').length,
        chantiersTermines: chantiers.filter(c => c.statut === 'termine').length,
        totalClients: clients.length
      });

      setRecentChantiers(chantiers.slice(0, 5));
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>Tableau de bord</h1>
        <p className="text-secondary">Bienvenue dans votre espace de gestion Florizar</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalChantiers}</h3>
            <p>Chantiers totaux</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚧</div>
          <div className="stat-content">
            <h3>{stats.chantiersEnCours}</h3>
            <p>En cours</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.chantiersTermines}</h3>
            <p>Terminés</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalClients}</h3>
            <p>Clients</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Actions rapides</h2>
        <div className="actions-grid">
          <Link to="/chantiers" className="action-card">
            <span className="action-icon">🏗️</span>
            <h3>Gérer les chantiers</h3>
            <p>Voir et gérer tous vos chantiers</p>
          </Link>

          <Link to="/clients" className="action-card">
            <span className="action-icon">📋</span>
            <h3>Gérer les clients</h3>
            <p>Voir et gérer vos fiches clients</p>
          </Link>
        </div>
      </div>

      {recentChantiers.length > 0 && (
        <div className="recent-section">
          <h2>Chantiers récents</h2>
          <div className="recent-list">
            {recentChantiers.map(chantier => (
              <div key={chantier.id} className="recent-item">
                <div className="recent-info">
                  <h4>{chantier.titre}</h4>
                  <p className="text-muted">
                    {chantier.client_nom} {chantier.client_prenom}
                  </p>
                </div>
                <span className={`badge badge-${chantier.statut === 'en_cours' ? 'info' : 'success'}`}>
                  {chantier.statut === 'en_cours' ? 'En cours' : 'Terminé'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
