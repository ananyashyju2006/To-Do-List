function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) {
  const getStatusClass = () => {
    switch (task.status) {
      case "Completed":
        return "badge completed";

      case "Pending":
        return "badge pending";

      default:
        return "badge";
    }
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case "High":
        return "priority high";

      case "Medium":
        return "priority medium";

      case "Low":
        return "priority low";

      default:
        return "priority";
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>

        <span className={getStatusClass()}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="task-description">
          {task.description}
        </p>
      )}

      <div className="task-details">
        <p>
          <strong>Priority:</strong>{" "}
          <span className={getPriorityClass()}>
            {task.priority}
          </span>
        </p>

        <p>
          <strong>Due Date:</strong>{" "}
          {task.dueDate
            ? new Date(
                task.dueDate
              ).toLocaleDateString()
            : "No Due Date"}
        </p>
      </div>

      <div className="task-actions">
        <button
          className="edit-btn"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(task._id)}
        >
          Delete
        </button>

        <button
          className={`complete-btn ${
            task.status === "completed"
              ? "pending-mode"
              : "complete-mode"
          }`}
          onClick={() => {
            console.log("Complete button clicked for task:", task._id);
            onToggleComplete(task._id);
          }}
        >
          {task.status === "completed"
            ? "Mark pending"
            : "Mark complete"}
        </button>
      </div>
    </div>
  );
}

export default TaskCard;