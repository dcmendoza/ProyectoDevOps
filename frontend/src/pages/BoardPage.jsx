import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { boardService } from '../services/boardService.js';
import { taskService } from '../services/taskService.js';
import TaskCard from '../components/TaskCard.jsx';
import TaskModal from '../components/TaskModal.jsx';

export default function BoardPage() {
  const { boardId } = useParams();
  const { token } = useAuth();
  const [board, setBoard] = useState(null);
  const [listName, setListName] = useState('');
  const [members, setMembers] = useState([]);
  const [modal, setModal] = useState({ open: false, listId: null, task: null });

  const load = async () => {
    const [boardData, membersData] = await Promise.all([
      boardService.getBoard(token, boardId),
      boardService.getMembers(token, boardId)
    ]);
    setBoard(boardData);
    setMembers(membersData);
  };

  useEffect(() => { load(); }, [boardId]);

  const createList = async (e) => {
    e.preventDefault();
    await boardService.createList(token, boardId, { name: listName });
    setListName('');
    load();
  };

  const onTaskSubmit = async (payload) => {
    if (modal.task?.id) {
      await taskService.updateTask(token, modal.task.id, payload);
    } else {
      await taskService.createTask(token, modal.listId, payload);
    }
    load();
  };

  const moveTask = async (taskId, targetListId, status) => {
    await taskService.moveTask(token, taskId, { targetListId, status });
    load();
  };

  const removeTask = async (taskId) => {
    await taskService.deleteTask(token, taskId);
    load();
  };

  if (!board) return <p>Cargando tablero...</p>;

  return (
    <section>
      <h2>{board.name}</h2>
      <p>{board.description}</p>
      <form className="row" onSubmit={createList}>
        <input placeholder="Nueva lista" value={listName} onChange={(e) => setListName(e.target.value)} required />
        <button className="btn">Agregar lista</button>
      </form>
      <div className="kanban">
        {board.lists?.map((list) => (
          <article className="list-col" key={list.id}>
            <header className="row">
              <h3>{list.name}</h3>
              <button className="btn-secondary" onClick={() => setModal({ open: true, listId: list.id, task: null })}>+ Tarea</button>
            </header>
            <div className="task-list">
              {list.tasks?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  lists={board.lists}
                  onMove={moveTask}
                  onEdit={(taskObj) => setModal({ open: true, listId: list.id, task: taskObj })}
                  onDelete={removeTask}
                />
              ))}
            </div>
          </article>
        ))}
      </div>

      <TaskModal
        open={modal.open}
        onClose={() => setModal({ open: false, listId: null, task: null })}
        onSubmit={onTaskSubmit}
        initialTask={modal.task || {}}
        members={members}
      />
    </section>
  );
}
