import { useState, useEffect } from 'react';
import { chantiersAPI, clientsAPI, photosAPI } from '../services/api';
import './Chantiers.css';

const Chantiers = () => {
  const [chantiers, setChantiers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPhotosModal, setShowPhotosModal] = useState(false);
  const [selectedChantier, setSelectedChantier] = useState(null);
  const [editingChantier, setEditingChantier] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const [formData, setFormData] = useState({
    client_id: '',
    titre: '',
    date_debut: '',
    date_fin: '',
    statut: 'en_cours',
    resume_travaux: '',
    notes_prochaine_fois: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [chantiersRes, clientsRes] = await Promise.all([
        chantiersAPI.getAll(),
        clientsAPI.getAll()
      ]);
      setChantiers(chantiersRes.data);
      setClients(clientsRes.data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingChantier) {
        await chantiersAPI.update(editingChantier.id, formData);
      } else {
        await chantiersAPI.create(formData);
      }
      loadData();
      resetForm();
    } catch (error) {
      console.error('Erreur sauvegarde chantier:', error);
      alert('Erreur lors de la sauvegarde du chantier');
    }
  };

  const handleEdit = (chantier) => {
    setEditingChantier(chantier);
    setFormData({
      client_id: chantier.client_id || '',
      titre: chantier.titre || '',
      date_debut: chantier.date_debut?.split('T')[0] || '',
      date_fin: chantier.date_fin?.split('T')[0] || '',
      statut: chantier.statut || 'en_cours',
      resume_travaux: chantier.resume_travaux || '',
      notes_prochaine_fois: chantier.notes_prochaine_fois || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce chantier ?')) {
      try {
        await chantiersAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Erreur suppression chantier:', error);
        alert('Erreur lors de la suppression du chantier');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      titre: '',
      date_debut: '',
      date_fin: '',
      statut: 'en_cours',
      resume_travaux: '',
      notes_prochaine_fois: ''
    });
    setEditingChantier(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openPhotosModal = async (chantier) => {
    setSelectedChantier(chantier);
    try {
      const response = await photosAPI.getByChantier(chantier.id);
      setPhotos(response.data);
      setShowPhotosModal(true);
    } catch (error) {
      console.error('Erreur chargement photos:', error);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingPhotos(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('photos', file);
      });

      await photosAPI.uploadMultiple(selectedChantier.id, formData);

      // Recharger les photos
      const response = await photosAPI.getByChantier(selectedChantier.id);
      setPhotos(response.data);
    } catch (error) {
      console.error('Erreur upload photos:', error);
      alert('Erreur lors de l\'upload des photos');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm('Supprimer cette photo ?')) {
      try {
        await photosAPI.delete(photoId);
        setPhotos(photos.filter(p => p.id !== photoId));
      } catch (error) {
        console.error('Erreur suppression photo:', error);
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

  return (
    <div className="container">
      <div className="page-header flex-between">
        <h1>Gestion des Chantiers</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nouveau Chantier
        </button>
      </div>

      <div className="chantiers-list">
        {chantiers.map((chantier) => (
          <div key={chantier.id} className="chantier-card">
            <div className="chantier-header">
              <div>
                <h3>{chantier.titre}</h3>
                <p className="text-muted">
                  Client: {chantier.client_nom} {chantier.client_prenom}
                  {chantier.client_entreprise && ` - ${chantier.client_entreprise}`}
                </p>
              </div>
              <span className={`badge ${getStatutBadge(chantier.statut)}`}>
                {getStatutLabel(chantier.statut)}
              </span>
            </div>

            <div className="chantier-dates">
              <div>
                <strong>Début:</strong> {new Date(chantier.date_debut).toLocaleDateString('fr-FR')}
              </div>
              {chantier.date_fin && (
                <div>
                  <strong>Fin:</strong> {new Date(chantier.date_fin).toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>

            {chantier.resume_travaux && (
              <div className="chantier-section">
                <strong>Résumé des travaux:</strong>
                <p>{chantier.resume_travaux}</p>
              </div>
            )}

            {chantier.notes_prochaine_fois && (
              <div className="chantier-section notes-prochaine">
                <strong>Notes pour la prochaine fois:</strong>
                <p>{chantier.notes_prochaine_fois}</p>
              </div>
            )}

            <div className="chantier-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => openPhotosModal(chantier)}
              >
                📷 Photos
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleEdit(chantier)}
              >
                Modifier
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(chantier.id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {chantiers.length === 0 && (
        <div className="empty-state">
          <p>Aucun chantier trouvé</p>
        </div>
      )}

      {/* Modal Formulaire Chantier */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingChantier ? 'Modifier le chantier' : 'Nouveau chantier'}</h2>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="client_id">Client *</label>
                  <select
                    id="client_id"
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.nom} {client.prenom} {client.entreprise && `- ${client.entreprise}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="titre">Titre du chantier *</label>
                  <input
                    type="text"
                    id="titre"
                    name="titre"
                    value={formData.titre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-2">
                  <div className="form-group">
                    <label htmlFor="date_debut">Date de début *</label>
                    <input
                      type="date"
                      id="date_debut"
                      name="date_debut"
                      value={formData.date_debut}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date_fin">Date de fin</label>
                    <input
                      type="date"
                      id="date_fin"
                      name="date_fin"
                      value={formData.date_fin}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="statut">Statut</label>
                  <select
                    id="statut"
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                  >
                    <option value="planifie">Planifié</option>
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                    <option value="annule">Annulé</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="resume_travaux">Résumé des travaux effectués</label>
                  <textarea
                    id="resume_travaux"
                    name="resume_travaux"
                    value={formData.resume_travaux}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Décrivez les travaux qui ont été réalisés..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes_prochaine_fois">Notes pour la prochaine fois</label>
                  <textarea
                    id="notes_prochaine_fois"
                    name="notes_prochaine_fois"
                    value={formData.notes_prochaine_fois}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Ce qu'il faudra faire lors de la prochaine intervention..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingChantier ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Photos */}
      {showPhotosModal && selectedChantier && (
        <div className="modal-overlay" onClick={() => setShowPhotosModal(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Photos - {selectedChantier.titre}</h2>
              <button className="close-btn" onClick={() => setShowPhotosModal(false)}>&times;</button>
            </div>

            <div className="modal-body">
              <div className="upload-section">
                <label htmlFor="photo-upload" className="btn btn-primary">
                  {uploadingPhotos ? 'Upload en cours...' : '+ Ajouter des photos'}
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                  disabled={uploadingPhotos}
                />
              </div>

              {photos.length > 0 ? (
                <div className="image-gallery">
                  {photos.map(photo => (
                    <div key={photo.id} className="image-item">
                      <img
                        src={`/uploads/${photo.filename}`}
                        alt={photo.original_name}
                      />
                      <div className="image-overlay">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted mt-lg">Aucune photo pour ce chantier</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chantiers;
