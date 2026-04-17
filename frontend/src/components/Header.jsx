import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="header">
      <Link to="/" className="brand">Mini Trello</Link>
      {token ? (
        <div className="header-actions">
          <span>{user?.name || 'Usuario'}</span>
          <button onClick={() => { logout(); navigate('/login'); }}>Salir</button>
        </div>
      ) : (
        <nav className="header-actions">
          <Link to="/login">Login</Link>
          <Link to="/register">Registro</Link>
        </nav>
      )}
    </header>
  );
}
