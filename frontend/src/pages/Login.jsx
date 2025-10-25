import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import './Login.css';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const result = await register(formData.username, formData.email, formData.password);
        if (result.success) {
          setIsRegister(false);
          setFormData({ username: '', email: '', password: '' });
          alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        } else {
          // Afficher les erreurs détaillées si disponibles
          if (result.details && result.details.length > 0) {
            setError(
              <div>
                <div>{result.error}</div>
                <ul style={{ marginTop: '10px', paddingLeft: '20px', textAlign: 'left' }}>
                  {result.details.map((detail, index) => (
                    <li key={index}>
                      {typeof detail === 'string'
                        ? detail
                        : detail.message || JSON.stringify(detail)}
                    </li>
                  ))}
                </ul>
              </div>
            );
          } else {
            setError(result.error);
          }
        }
      } else {
        const result = await login(formData.username, formData.password);
        if (result.success) {
          navigate('/chantiers');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🌿 Florizar</h1>
          <p>Gestion de chantiers paysagistes</p>
        </div>

        <div className="login-card">
          <h2>{isRegister ? 'Inscription' : 'Connexion'}</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Nom d'utilisateur</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            {isRegister && (
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
              />
              {isRegister && (
                <small className="form-hint">
                  Minimum 8 caractères avec majuscule, minuscule, chiffre et caractère spécial (!@#$%^&*...)
                </small>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Chargement...' : (isRegister ? 'S\'inscrire' : 'Se connecter')}
            </button>
          </form>

          <div className="login-toggle">
            <button
              type="button"
              className="toggle-link"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister
                ? 'Déjà un compte ? Se connecter'
                : 'Pas encore de compte ? S\'inscrire'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
