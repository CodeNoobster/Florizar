import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientsAPI } from '../services/api';
import './Clients.css';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getAll();
      setClients(response.data);
    } catch (error) {
      console.error('Erreur chargement clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.id, formData);
      } else {
        await clientsAPI.create(formData);
      }
      loadClients();
      resetForm();
    } catch (error) {
      console.error('Erreur sauvegarde client:', error);
      alert('Erreur lors de la sauvegarde du client');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      nom: client.nom || '',
      prenom: client.prenom || '',
      entreprise: client.entreprise || '',
      telephone: client.telephone || '',
      email: client.email || '',
      adresse: client.adresse || '',
      ville: client.ville || '',
      code_postal: client.code_postal || '',
      notes: client.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await clientsAPI.delete(id);
        loadClients();
      } catch (error) {
        console.error('Erreur suppression client:', error);
        alert('Erreur lors de la suppression du client');
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
    setEditingClient(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredClients = clients.filter(client =>
    (client.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     client.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     client.entreprise?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div className="page-header flex-between">
        <h1>Gestion des Clients</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nouveau Client
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="clients-grid">
        {filteredClients.map((client) => (
          <div key={client.id} className="client-card">
            <div className="client-header">
              <h3>{client.nom} {client.prenom}</h3>
              {client.entreprise && <p className="text-muted">{client.entreprise}</p>}
            </div>

            <div className="client-info">
              {client.telephone && (
                <div className="info-row">
                  <span className="info-label">📞</span>
                  <span>{client.telephone}</span>
                </div>
              )}
              {client.email && (
                <div className="info-row">
                  <span className="info-label">📧</span>
                  <span>{client.email}</span>
                </div>
              )}
              {client.adresse && (
                <div className="info-row">
                  <span className="info-label">📍</span>
                  <span>{client.adresse}, {client.code_postal} {client.ville}</span>
                </div>
              )}
              {client.notes && (
                <div className="info-row notes">
                  <span className="info-label">📝</span>
                  <span>{client.notes}</span>
                </div>
              )}
            </div>

            <div className="client-actions">
              <Link to={`/clients/${client.id}`} className="btn btn-primary btn-sm">
                Voir détails
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(client)}>
                Modifier
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(client.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="empty-state">
          <p>Aucun client trouvé</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingClient ? 'Modifier le client' : 'Nouveau client'}</h2>
              <button className="close-btn" onClick={resetForm}>&times;</button>
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
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingClient ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
