import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { clientsAPI, chantiersAPI } from '../services/api';
import './ClientDetail.css';

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [chantiers, setChantiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    entreprise: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    code_postal: '',
    notes: ''
  });

  useEffect(() => {
    loadClientData();
  }, [id]);

  const loadClientData = async () => {
    try {
      const [clientRes, chantiersRes] = await Promise.all([
        clientsAPI.getById(id),
        chantiersAPI.getByClient(id)
      ]);
      setClient(clientRes.data);
      setChantiers(chantiersRes.data);
      setFormData({
        nom: clientRes.data.nom || '',
        prenom: clientRes.data.prenom || '',
        entreprise: clientRes.data.entreprise || '',
        telephone: clientRes.data.telephone || '',
        email: clientRes.data.email || '',
        adresse: clientRes.data.adresse || '',
        ville: clientRes.data.ville || '',
        code_postal: clientRes.data.code_postal || '',
        notes: clientRes.data.notes || ''
      });
    } catch (error) {
      console.error('Erreur chargement client:', error);
      navigate('/clients');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await clientsAPI.update(id, formData);
      loadClientData();
      setShowEditModal(false);
    } catch (error) {
      console.error('Erreur mise à jour client:', error);
      alert('Erreur lors de la mise à jour du client');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client et tous ses chantiers ?')) {
      try {
        await clientsAPI.delete(id);
        navigate('/clients');
      } catch (error) {
        console.error('Erreur suppression client:', error);
        alert('Erreur lors de la suppression du client');
      }
    }
  };

  const getStatutBadge = (statut) => {
    const badges = {
      'en_cours': 'badge-info',
      'termine': 'badge-success',
      'annule': 'badge-danger',
      'planifie': 'badge-warning'
    };
    return badges[statut] || 'badge-info';
  };

  const getStatutLabel = (statut) => {
    const labels = {
      'en_cours': 'En cours',
      'termine': 'Terminé',
      'annule': 'Annulé',
      'planifie': 'Planifié'
    };
    return labels[statut] || statut;
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!client) {
    return <div className="container"><p>Client non trouvé</p></div>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <button className="btn btn-secondary" onClick={() => navigate('/clients')}>
          ← Retour aux clients
        </button>
      </div>

      <div className="client-detail-header">
        <div className="client-main-info">
          <h1>
            {client.nom} {client.prenom}
            {client.entreprise && <span className="entreprise-badge">{client.entreprise}</span>}
          </h1>

          <div className="client-contact-grid">
            {client.telephone && (
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <div className="contact-label">Téléphone</div>
                  <a href={`tel:${client.telephone}`}>{client.telephone}</a>
                </div>
              </div>
            )}

            {client.email && (
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <div className="contact-label">Email</div>
                  <a href={`mailto:${client.email}`}>{client.email}</a>
                </div>
              </div>
            )}

            {client.adresse && (
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div>
                  <div className="contact-label">Adresse</div>
                  <div>
                    {client.adresse}<br />
                    {client.code_postal} {client.ville}
                  </div>
                </div>
              </div>
            )}
          </div>

          {client.notes && (
            <div className="client-notes">
              <h3>Notes</h3>
              <p>{client.notes}</p>
            </div>
          )}
        </div>

        <div className="client-actions">
          <button className="btn btn-primary" onClick={() => setShowEditModal(true)}>
            ✏️ Modifier
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            🗑️ Supprimer
          </button>
        </div>
      </div>

      <div className="client-chantiers-section">
        <div className="section-header flex-between">
          <h2>
            Chantiers du client
            <span className="count-badge">{chantiers.length}</span>
          </h2>
          <Link
            to="/chantiers"
            state={{ preselectedClientId: id }}
            className="btn btn-primary"
          >
            + Nouveau chantier
          </Link>
        </div>

        {chantiers.length > 0 ? (
          <div className="chantiers-grid">
            {chantiers.map((chantier) => (
              <div key={chantier.id} className="chantier-card-mini">
                <div className="chantier-card-header">
                  <h3>{chantier.titre}</h3>
                  <span className={`badge ${getStatutBadge(chantier.statut)}`}>
                    {getStatutLabel(chantier.statut)}
                  </span>
                </div>

                <div className="chantier-dates">
                  <div>
                    <strong>Début:</strong>{' '}
                    {new Date(chantier.date_debut).toLocaleDateString('fr-FR')}
                  </div>
                  {chantier.date_fin && (
                    <div>
                      <strong>Fin:</strong>{' '}
                      {new Date(chantier.date_fin).toLocaleDateString('fr-FR')}
                    </div>
                  )}
                </div>

                {chantier.resume_travaux && (
                  <p className="chantier-resume">{chantier.resume_travaux}</p>
                )}

                <Link
                  to="/chantiers"
                  state={{ scrollToChantier: chantier.id }}
                  className="btn btn-secondary btn-sm mt-md"
                >
                  Voir les détails →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Aucun chantier pour ce client</p>
            <Link
              to="/chantiers"
              state={{ preselectedClientId: id }}
              className="btn btn-primary mt-md"
            >
              Créer le premier chantier
            </Link>
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Modifier le client</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="grid grid-2">
                  <div className="form-group">
                    <label htmlFor="nom">Nom *</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="prenom">Prénom</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="entreprise">Entreprise</label>
                  <input
                    type="text"
                    id="entreprise"
                    name="entreprise"
                    value={formData.entreprise}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label htmlFor="telephone">Téléphone</label>
                    <input
                      type="tel"
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="adresse">Adresse</label>
                  <input
                    type="text"
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label htmlFor="code_postal">Code postal</label>
                    <input
                      type="text"
                      id="code_postal"
                      name="code_postal"
                      value={formData.code_postal}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ville">Ville</label>
                    <input
                      type="text"
                      id="ville"
                      name="ville"
                      value={formData.ville}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetail;
