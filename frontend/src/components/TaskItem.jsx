export default function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  const statusClass = `status-badge status-${task.status}`;

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h4>{task.title}</h4>
        <span className={statusClass}>{task.status}</span>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      {task.due_date && (
        <p className="task-due-date">Due: {new Date(task.due_date).toLocaleDateString()}</p>
      )}

      <div className="task-card-actions">
        <select value={task.status} onChange={(e) => onStatusChange(task.id, e.target.value)}>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="btn btn-small" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn btn-small btn-danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}
