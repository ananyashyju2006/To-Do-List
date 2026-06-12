import { useEffect, useState } from "react";
import axios from "axios";

import TaskCard from "../components/TaskCard";
import AddTask from "../components/AddTask";
import EditTask from "../components/EditTask";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === updatedTask._id
          ? updatedTask
          : task
      )
    );

    setEditingTask(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this task?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasks((prev) =>
        prev.filter(
          (task) => task._id !== id
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const toggleComplete = async (id) => {
    console.log("Clicked:", id);
    try {
      const token = localStorage.getItem("token");

      const res = await axios.patch(
        `http://localhost:5000/api/tasks/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", res.data);
      setTasks((prev) =>
        prev.map((task) =>
          task._id === id
            ? res.data
            : task
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const filteredTasks = tasks.filter(
    (task) => {
      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        task.description
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          );

      let matchesFilter = true;

      if (filter === "pending") {
        matchesFilter =
          task.status === "pending";
      }

      if (filter === "completed") {
        matchesFilter =
          task.status === "completed";
      }

      if (filter === "high") {
        matchesFilter =
          task.priority?.toLowerCase() ===
          "high";
      }

      return (
        matchesSearch && matchesFilter
      );
    }
  );

  const allCount = tasks.length;

  const pendingCount = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const completedCount = tasks.filter(
    (task) =>
      task.status === "completed"
  ).length;

  const highCount = tasks.filter(
    (task) =>
      task.priority?.toLowerCase() ===
      "high"
  ).length;

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <h1>My Tasks</h1>

      <input
        type="text"
        className="search-input"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(
            e.target.value
          )
        }
      />

      <div className="filter-tabs">
        <button
          onClick={() =>
            setFilter("all")
          }
        >
          All ({allCount})
        </button>

        <button
          onClick={() =>
            setFilter("pending")
          }
        >
          Pending ({pendingCount})
        </button>

        <button
          onClick={() =>
            setFilter("completed")
          }
        >
          Completed (
          {completedCount})
        </button>

        <button
          onClick={() =>
            setFilter("high")
          }
        >
          High Priority (
          {highCount})
        </button>
      </div>

      <AddTask
        onTaskAdded={handleTaskAdded}
      />

      {editingTask && (
        <EditTask
          task={editingTask}
          onTaskUpdated={
            handleTaskUpdated
          }
          onClose={() =>
            setEditingTask(null)
          }
        />
      )}

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h2>No Tasks Found</h2>
          <p>
            Try changing your search
            or filter.
          </p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map(
            (task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={
                  setEditingTask
                }
                onDelete={
                  handleDelete
                }
                onToggleComplete={
                  toggleComplete
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Tasks;