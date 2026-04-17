import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { boardService } from '../services/boardService.js';
import BoardCard from '../components/BoardCard.jsx';

export default function DashboardPage() {
  const { token } = useAuth();
  const [boards, setBoards] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setLoading(true);
      const data = await boardService.getBoards(token);
      setBoards(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await boardService.createBoard(token, { name, description });
    setName('');
    setDescription('');
    load();
  };

  if (loading) return <p>Cargando tableros...</p>;

  return (
    <section>
      <h2>Mis tableros</h2>
      <form className="card" onSubmit={create}>
        <h3>Crear tablero</h3>
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button className="btn" type="submit">Crear</button>
      </form>
      {error && <p className="error">{error}</p>}
      <div className="board-grid">
        {boards.length ? boards.map((board) => <BoardCard key={board.id} board={board} />) : <p>No hay tableros aún.</p>}
      </div>
    </section>
  );
}
