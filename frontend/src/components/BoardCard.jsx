import { Link } from 'react-router-dom';

export default function BoardCard({ board }) {
  return (
    <article className="card">
      <h3>{board.name}</h3>
      <p>{board.description || 'Sin descripción'}</p>
      <small>{board._count?.lists || 0} listas</small>
      <Link to={`/boards/${board.id}`} className="btn">Abrir tablero</Link>
    </article>
  );
}
