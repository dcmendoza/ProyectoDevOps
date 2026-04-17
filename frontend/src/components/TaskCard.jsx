export default function TaskCard({ task, lists, onMove, onEdit, onDelete }) {
  return (
    <article className="task-card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <small>Estado: {task.status}</small>
      <div className="row gap-xs">
        <select onChange={(e) => onMove(task.id, e.target.value)} defaultValue={task.listId}>
          {lists.map((list) => <option key={list.id} value={list.id}>{list.name}</option>)}
        </select>
        <select onChange={(e) => onMove(task.id, task.listId, e.target.value)} defaultValue={task.status}>
          <option value="TODO">To Do</option>
          <option value="DOING">Doing</option>
          <option value="DONE">Done</option>
        </select>
      </div>
      <div className="row gap-xs">
        <button className="btn-secondary" onClick={() => onEdit(task)}>Editar</button>
        <button className="btn-danger" onClick={() => onDelete(task.id)}>Eliminar</button>
      </div>
    </article>
  );
}
