import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactsAPI } from '../services/api';
import './Contacts.css';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'physique', 'morale'
  const [filterActif, setFilterActif] = useState('all'); // 'all', 'actif', 'inactif'

  const [formData, setFormData] = useState({
    type_personne: 'physique',
    nom: '',
    prenom: '',
    raison_sociale: '',
    telephone: '',
    telephone_secondaire: '',
    email: '',
    adresse: '',
    ville: '',
    code_postal: '',
    pays: 'France',
    siret: '',
    tva_intracommunautaire: '',
    forme_juridique: '',
    actif: true,
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await contactsAPI.getAll();
      setContacts(response.data);
    } catch (error) {
      console.error('Erreur chargement contacts:', error);
      setError('Erreur lors du chargement des contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Préparer les données selon le type
      const dataToSend = {
        ...formData,
        actif: formData.actif ? 1 : 0,
        // Si personne physique, vider raison_sociale et champs entreprise
        ...(formData.type_personne === 'physique' && {
          raison_sociale: null,
          siret: null,
          tva_intracommunautaire: null,
          forme_juridique: null
        })
      };

      if (editingContact) {
        await contactsAPI.update(editingContact.id, dataToSend);
      } else {
        await contactsAPI.create(dataToSend);
      }

      loadContacts();
      resetForm();
    } catch (error) {
      console.error('Erreur sauvegarde contact:', error);
      const errorMsg = error.response?.data?.error || 'Erreur lors de la sauvegarde du contact';
      const details = error.response?.data?.details;

      if (details && details.length > 0) {
        setError(`${errorMsg}: ${details.map(d => d.message).join(', ')}`);
      } else {
        setError(errorMsg);
      }
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      type_personne: contact.type_personne || 'physique',
      nom: contact.nom || '',
      prenom: contact.prenom || '',
      raison_sociale: contact.raison_sociale || '',
      telephone: contact.telephone || '',
      telephone_secondaire: contact.telephone_secondaire || '',
      email: contact.email || '',
      adresse: contact.adresse || '',
      ville: contact.ville || '',
      code_postal: contact.code_postal || '',
      pays: contact.pays || 'France',
      siret: contact.siret || '',
      tva_intracommunautaire: contact.tva_intracommunautaire || '',
      forme_juridique: contact.forme_juridique || '',
      actif: contact.actif === 1,
      notes: contact.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
      try {
        await contactsAPI.delete(id);
        loadContacts();
      } catch (error) {
        console.error('Erreur suppression contact:', error);
        alert('Erreur lors de la suppression du contact');
      }
    }
  };

  const handleToggleActif = async (id) => {
    try {
      await contactsAPI.toggleActif(id);
      loadContacts();
    } catch (error) {
      console.error('Erreur toggle actif:', error);
      alert('Erreur lors du changement de statut');
    }
  };

  const resetForm = () => {
    setFormData({
      type_personne: 'physique',
      nom: '',
      prenom: '',
      raison_sociale: '',
      telephone: '',
      telephone_secondaire: '',
      email: '',
      adresse: '',
      ville: '',
      code_postal: '',
      pays: 'France',
      siret: '',
      tva_intracommunautaire: '',
      forme_juridique: '',
      actif: true,
      notes: ''
    });
    setEditingContact(null);
    setShowModal(false);
    setError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const getContactDisplayName = (contact) => {
    if (contact.type_personne === 'morale') {
      return contact.raison_sociale || contact.nom;
    }
    return `${contact.nom} ${contact.prenom || ''}`.trim();
  };

  const getContactSubtitle = (contact) => {
    if (contact.type_personne === 'morale') {
      return `Entreprise${contact.forme_juridique ? ` (${contact.forme_juridique})` : ''}`;
    }
    return 'Particulier';
  };

  // Filtrage des contacts
  const filteredContacts = contacts.filter(contact => {
    // Filtre par recherche
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      contact.nom?.toLowerCase().includes(searchLower) ||
      contact.prenom?.toLowerCase().includes(searchLower) ||
      contact.raison_sociale?.toLowerCase().includes(searchLower) ||
      contact.email?.toLowerCase().includes(searchLower) ||
      contact.telephone?.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Filtre par type
    if (filterType !== 'all' && contact.type_personne !== filterType) {
      return false;
    }

    // Filtre par actif/inactif
    if (filterActif === 'actif' && contact.actif !== 1) return false;
    if (filterActif === 'inactif' && contact.actif === 1) return false;

    return true;
  });

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="container">
      <div className="page-header flex-between">
        <h1>Gestion des Contacts</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Nouveau Contact
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="Rechercher un contact..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="filter-group">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les types</option>
            <option value="physique">Particuliers</option>
            <option value="morale">Entreprises</option>
          </select>

          <select
            value={filterActif}
            onChange={(e) => setFilterActif(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actifs</option>
            <option value="inactif">Inactifs</option>
          </select>
        </div>
      </div>

      <div className="contacts-grid">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={`contact-card ${contact.actif !== 1 ? 'inactive' : ''}`}
          >
            <div className="contact-header">
              <div>
                <h3>
                  {contact.type_personne === 'morale' && '🏢 '}
                  {contact.type_personne === 'physique' && '👤 '}
                  {getContactDisplayName(contact)}
                </h3>
                <p className="text-muted">{getContactSubtitle(contact)}</p>
              </div>
              {contact.actif !== 1 && (
                <span className="badge badge-inactive">Inactif</span>
              )}
            </div>

            <div className="contact-info">
              {contact.telephone && (
                <div className="info-row">
                  <span className="info-label">📞</span>
                  <span>{contact.telephone}</span>
                </div>
              )}
              {contact.email && (
                <div className="info-row">
                  <span className="info-label">📧</span>
                  <span>{contact.email}</span>
                </div>
              )}
              {contact.adresse && (
                <div className="info-row">
                  <span className="info-label">📍</span>
                  <span>
                    {contact.adresse}
                    {contact.code_postal && `, ${contact.code_postal}`}
                    {contact.ville && ` ${contact.ville}`}
                  </span>
                </div>
              )}
              {contact.siret && (
                <div className="info-row">
                  <span className="info-label">🏛️</span>
                  <span>SIRET: {contact.siret}</span>
                </div>
              )}
            </div>

            <div className="contact-actions">
              <Link to={`/contacts/${contact.id}`} className="btn btn-primary btn-sm">
                Voir détails
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(contact)}>
                Modifier
              </button>
              <button
                className={`btn btn-sm ${contact.actif === 1 ? 'btn-warning' : 'btn-success'}`}
                onClick={() => handleToggleActif(contact.id)}
                title={contact.actif === 1 ? 'Désactiver' : 'Activer'}
              >
                {contact.actif === 1 ? 'Désactiver' : 'Activer'}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(contact.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="empty-state">
          <p>Aucun contact trouvé</p>
        </div>
      )}

      {/* Modal de création/édition */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingContact ? 'Modifier le contact' : 'Nouveau contact'}</h2>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="error-message">{error}</div>}

                {/* Type de personne */}
                <div className="form-group">
                  <label>Type de contact *</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="type_personne"
                        value="physique"
                        checked={formData.type_personne === 'physique'}
                        onChange={handleChange}
                      />
                      <span>👤 Particulier</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="type_personne"
                        value="morale"
                        checked={formData.type_personne === 'morale'}
                        onChange={handleChange}
                      />
                      <span>🏢 Entreprise</span>
                    </label>
                  </div>
                </div>

                {/* Champs selon le type */}
                {formData.type_personne === 'physique' ? (
                  // Personne physique
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
                ) : (
                  // Personne morale (entreprise)
                  <>
                    <div className="form-group">
                      <label htmlFor="raison_sociale">Raison sociale *</label>
                      <input
                        type="text"
                        id="raison_sociale"
                        name="raison_sociale"
                        value={formData.raison_sociale}
                        onChange={handleChange}
                        required
                        placeholder="Nom de l'entreprise"
                      />
                    </div>

                    <div className="grid grid-2">
                      <div className="form-group">
                        <label htmlFor="forme_juridique">Forme juridique</label>
                        <select
                          id="forme_juridique"
                          name="forme_juridique"
                          value={formData.forme_juridique}
                          onChange={handleChange}
                        >
                          <option value="">Sélectionner...</option>
                          <option value="SARL">SARL</option>
                          <option value="SAS">SAS</option>
                          <option value="SA">SA</option>
                          <option value="EURL">EURL</option>
                          <option value="SCI">SCI</option>
                          <option value="Auto-entrepreneur">Auto-entrepreneur</option>
                          <option value="Association">Association</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="siret">SIRET</label>
                        <input
                          type="text"
                          id="siret"
                          name="siret"
                          value={formData.siret}
                          onChange={handleChange}
                          placeholder="14 chiffres"
                          maxLength="14"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="tva_intracommunautaire">N° TVA Intracommunautaire</label>
                      <input
                        type="text"
                        id="tva_intracommunautaire"
                        name="tva_intracommunautaire"
                        value={formData.tva_intracommunautaire}
                        onChange={handleChange}
                        placeholder="FR12345678901"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="nom">Nom du contact (optionnel)</label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        placeholder="Nom de l'interlocuteur principal"
                      />
                    </div>
                  </>
                )}

                {/* Coordonnées */}
                <div className="section-divider">
                  <h3>Coordonnées</h3>
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
                    <label htmlFor="telephone_secondaire">Téléphone secondaire</label>
                    <input
                      type="tel"
                      id="telephone_secondaire"
                      name="telephone_secondaire"
                      value={formData.telephone_secondaire}
                      onChange={handleChange}
                    />
                  </div>
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

                {/* Adresse */}
                <div className="section-divider">
                  <h3>Adresse</h3>
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

                <div className="grid grid-3">
                  <div className="form-group">
                    <label htmlFor="code_postal">Code postal</label>
                    <input
                      type="text"
                      id="code_postal"
                      name="code_postal"
                      value={formData.code_postal}
                      onChange={handleChange}
                      maxLength="5"
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

                  <div className="form-group">
                    <label htmlFor="pays">Pays</label>
                    <input
                      type="text"
                      id="pays"
                      name="pays"
                      value={formData.pays}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Notes et statut */}
                <div className="section-divider">
                  <h3>Informations complémentaires</h3>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Notes internes..."
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="actif"
                      checked={formData.actif}
                      onChange={handleChange}
                    />
                    <span>Contact actif</span>
                  </label>
                  <small className="form-hint">
                    Les contacts inactifs sont archivés mais restent accessibles
                  </small>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingContact ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
