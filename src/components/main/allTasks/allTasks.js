import { useState, useEffect } from "react";
import Task from "../task/task";
import style from "./allTasks.module.css"
import TaskInfoPanel from "../../taskInfoPanel/taskInfoPanel";

function AllTasks({ currentFilter }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setList(savedTasks);
  }, [list]);

  const deleteTask = (id) => {
    const updatedList = list.filter((task) => task.id !== id)
    setList(updatedList)
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
  const updatedList = list.map(task =>
    task.id === id ? { ...task, text: newText } : task
  );
  setList(updatedList);
  localStorage.setItem("tasks", JSON.stringify(updatedList));
};

  return (
    <>
    <div className={style.tasks_list}>
      {filterTasks(list).map((task) => (
        <Task
          text={task.text}
          key={task.id}
          deleteTask={() => deleteTask(task.id)}
          id={task.id}
          onOpenTask={() => handleOpenTask(task.id)}
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