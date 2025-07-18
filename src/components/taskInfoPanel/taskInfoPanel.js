import { useEffect, useState, useRef } from "react";
import style from "./taskInfoPanel.module.css";

function TaskInfoPanel({ taskId, visible, onClose, updateTaskText }) {
  const [task, setTask] = useState(null);
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const [taskText, setTaskText] = useState("");

  const panelRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (panelRef.current && !panelRef.current.contains(e.target)) {
      onClose();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  useEffect(() => {
    if (!taskId) return;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const taskDates = JSON.parse(localStorage.getItem("taskDates")) || {};
    const comments = JSON.parse(localStorage.getItem("taskComments")) || {};

    const found = tasks.find(t => t.id === taskId);
    if (found) {
      setTask(found);
      setTaskText(found.text);
      setDate(taskDates[taskId]);
      setComment(comments[taskId] || "");
    }
  }, [taskId]);

  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    setComment(newComment);

    const comments = JSON.parse(localStorage.getItem("taskComments")) || {};
    comments[taskId] = newComment;
    localStorage.setItem("taskComments", JSON.stringify(comments));
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setTaskText(newText);
    updateTaskText(taskId, newText);
  };

  if (!visible || !task) return null;

  return (
    <div
      className={`${style.panel} ${visible ? style.open : ""}`}
      ref={panelRef}
    >
      <button className={style.close} onClick={onClose}>✖</button>
      <h3>📌 Задача</h3>
      <label htmlFor="taskText">✏️ Текст задачи:</label>
      <input
        id="taskText"
        type="text"
        className={style.taskInput}
        value={taskText}
        onChange={handleTextChange}
      />
      <p><strong>Дата:</strong> {date}</p>
      <p><strong>Статус:</strong> {JSON.parse(localStorage.getItem("buttonStates"))?.[`${taskId}-done`] ? "✅ выполнена" : "🕒 активна"}</p>
      <p><strong>Важность:</strong> {JSON.parse(localStorage.getItem("buttonStates"))?.[`${taskId}-important`] ? "❗ важная" : "—"}</p>
      <label htmlFor="comment">💬 Комментарий к задаче:</label>
      <textarea
        id="comment"
        className={style.commentBox}
        value={comment}
        onChange={handleCommentChange}
      />
    </div>
  );
}

export default TaskInfoPanel;
