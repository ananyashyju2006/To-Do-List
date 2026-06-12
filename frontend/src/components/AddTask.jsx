import { useState } from "react";
import axiosInstance from "../services/axiosInstance";

export default function AddTask({ onTaskAdded }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(`${name}:`, value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Task:");
    console.log(formData);

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/tasks",
        formData
      );

      console.log("Server Response:");
      console.log(res.data);

      onTaskAdded(res.data);

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
      });

      alert("Task added successfully!");
    } catch (error) {
      console.error("ADD TASK ERROR:");
      console.error(error);

      console.error("SERVER RESPONSE:");
      console.error(error.response?.data);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to add task"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Add New Task</h2>

      <form
        onSubmit={handleSubmit}
        className="task-form"
      >
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
        >
          <option value="low">
            Low Priority
          </option>

          <option value="medium">
            Medium Priority
          </option>

          <option value="high">
            High Priority
          </option>
        </select>

        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
    </div>
  );
}