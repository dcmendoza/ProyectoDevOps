import { useState } from 'react';

export default function TaskModal({ open, onClose, onSubmit, initialTask = {}, members = [] }) {
  const [form, setForm] = useState({
    title: initialTask.title || '',
    description: initialTask.description || '',
    status: initialTask.status || 'TODO',
    priority: initialTask.priority || 'MEDIUM',
    assignedUserId: initialTask.assignedUserId || ''
  });

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{initialTask.id ? 'Editar tarea' : 'Nueva tarea'}</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); onClose(); }}>
          <input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="TODO">To Do</option>
            <option value="DOING">Doing</option>
            <option value="DONE">Done</option>
          </select>
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
          <select value={form.assignedUserId} onChange={(e) => setForm({ ...form, assignedUserId: e.target.value })}>
            <option value="">Sin asignar</option>
            {members.map((member) => <option key={member.user.id} value={member.user.id}>{member.user.name}</option>)}
          </select>
          <div className="row">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
