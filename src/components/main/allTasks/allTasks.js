import { useState } from "react";
import Task from "../task/task";
import style from "./allTasks.module.css"
import TaskInfoPanel from "../../taskInfoPanel/taskInfoPanel";

function AllTasks({ currentFilter, tasks, setTasks }) {

  const deleteTask = (id) => {
    const updatedList = tasks.filter((task) => task.id !== id)
    setTasks(updatedList)
    localStorage.setItem('tasks', JSON.stringify(updatedList))
  }

  const filterTasks = (tasks) => {
    const buttonStates = JSON.parse(localStorage.getItem("buttonStates")) || {};
    const taskDates = JSON.parse(localStorage.getItem("taskDates")) || {};
    const today = new Date().toISOString().split('T')[0];

    return tasks.filter(task => {
      const isImportant = buttonStates[`${task.id}-important`] === true;
      const isDone = buttonStates[`${task.id}-done`] === true;
      const taskDate = taskDates[task.id];

      switch(currentFilter) {
        case 'all':
          return true;
        case 'current':
          return !isDone;
        case 'today':
          return taskDate === today && !isDone;
        case 'important':
          return isImportant && !isDone;
        case 'completed':
          return isDone;
        default:
          return true;
      }
    });
  };

  const [openedTaskId, setOpenedTaskId] = useState(null);

  const handleOpenTask = (id) => {
  setOpenedTaskId(id);
};

  const updateTaskText = (id, newText) => {
    if (!Array.isArray(tasks)) return;

    const updated = tasks.map(t =>
      t.id === id ? { ...t, text: newText } : t
    );
    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  return (
    <>
    <div className={style.tasks_list}>
      {filterTasks(tasks).map((task) => (
        <Task
          text={task.text}
          key={task.id}
          deleteTask={() => deleteTask(task.id)}
          id={task.id}
          onOpenTask={() => handleOpenTask(task.id)}
          onTextChange={updateTaskText}
        />
      ))}
    </div>
    <TaskInfoPanel
      taskId={openedTaskId}
      visible={!!openedTaskId}
      onClose={() => setOpenedTaskId(null)}
      updateTaskText={updateTaskText}
    />
    </>
  );
}

export default AllTasks;