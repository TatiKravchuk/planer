import { useState, useEffect } from "react";
import style from "./task.module.css";
import TooltipPortal from "./tooltip/tooltip";

function Task({ text, id, deleteTask, onOpenTask, onTextChange, group, handleUpdateGroup }) {

  const [isImportant, setisImportant] = useState(JSON.parse(localStorage.getItem("buttonStates"))?.[`${id}-important`] || false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [tooltipSource, setTooltipSource] = useState('');
  const [taskText, setTaskText] = useState(text);
  const [localGroup, setLocalGroup] = useState(group || "");

  const groupColorMap = {
  work: "#007bff",
  personal: "#f06292",
  study: "#ffa000",
  health: "#4caf50",
  finance: "#00bcd4",
  events: "#e91e63",
  travel: "#673ab7",
  home: "#795548"
};

  useEffect(() => {
  const buttonStates = JSON.parse(localStorage.getItem("buttonStates")) || {};
  buttonStates[`${id}-important`] = isImportant;
  localStorage.setItem("buttonStates", JSON.stringify(buttonStates));
  }, [isImportant, id]);

  const toggleImportant = () => {
    setisImportant(!isImportant);
  };

  const [isDone, setIsDone] = useState(
  JSON.parse(localStorage.getItem("buttonStates"))?.[`${id}-done`] || false
  );

  useEffect(() => {
    const buttonStates = JSON.parse(localStorage.getItem("buttonStates")) || {};
    buttonStates[`${id}-done`] = isDone;
    localStorage.setItem("buttonStates", JSON.stringify(buttonStates));
  }, [isDone, id]);

  const toggleDone = () => {
    setIsDone(!isDone);
  };

  const [taskDate, setTaskDate] = useState(
    JSON.parse(localStorage.getItem("taskDates"))?.[id] || ""
  );

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
  const taskDates = JSON.parse(localStorage.getItem("taskDates")) || {};
  const storedDate = taskDates[id] || "";
  setTaskDate(storedDate);

  if (storedDate) {
    const today = new Date();
    today.setTime(today.getTime() - 86400000);
    const deadline = new Date(storedDate);
    setIsExpired(deadline > today);
  }

  }, [id]);

  const handleDateChange = (event) => {
  const newDate = event.target.value;
  setTaskDate(newDate);

  const taskDates = JSON.parse(localStorage.getItem("taskDates")) || {};
  taskDates[id] = newDate;
  localStorage.setItem("taskDates", JSON.stringify(taskDates));

  const today = new Date();
  today.setTime(today.getTime() - 86400000);
  const taskDeadline = new Date(newDate);
  const expiredStatus = taskDeadline < today;

  setIsExpired(expiredStatus);

  const expiredTasks = JSON.parse(localStorage.getItem("expiredTasks")) || {};
  expiredTasks[id] = expiredStatus;
  localStorage.setItem("expiredTasks", JSON.stringify(expiredTasks));
  };

  useEffect(() => {
  const expiredTasks = JSON.parse(localStorage.getItem("expiredTasks")) || {};
  setIsExpired(expiredTasks[id] || false);
  }, [id]);

  function refuseReload(e) {
    e.preventDefault();
  }

const showTooltipHandler = (e, source) => {
  const rect = e.currentTarget.getBoundingClientRect();
  setTooltipPos({
    top: rect.bottom + 8,
    left: rect.left + rect.width / 2,
  });
  setTooltipSource(source);
  setTooltipVisible(true);

  if (source === 'important') {
    setTooltipText(isImportant
      ? 'Убрать задачу из важных'
      : 'Сделать задачу важной');
  } else if (source === 'done') {
    setTooltipText(isDone
      ? 'Убрать задачу из выполненных'
      : 'Отметить задачу как выполненную');
  } else if (source === 'delete') {
    setTooltipText('Удалить задачу');
  }
};

const hideTooltipHandler = () => setTooltipVisible(false);

const handleTextChange = (e) => {
  const newText = e.target.value;
  setTaskText(newText);

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index].text = newText;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    if (onTextChange) onTextChange(id, newText);
  }
};

useEffect(() => {
  if (tooltipVisible && tooltipSource === 'important') {
    setTooltipText(isImportant
      ? 'Убрать задачу из важных'
      : 'Сделать задачу важной');
  }
}, [isImportant, tooltipSource, tooltipVisible]);

useEffect(() => {
  if (tooltipVisible && tooltipSource === 'done') {
    setTooltipText(isDone
      ? 'Убрать задачу из выполненных'
      : 'Отметить задачу как выполненную');
  }
}, [isDone, tooltipSource, tooltipVisible]);

useEffect(() => {
  const interval = setInterval(() => {
    if (taskDate) {
      const today = new Date();
      today.setTime(today.getTime() - 86400000);
      const deadline = new Date(taskDate);
      const expired = deadline < today;
      setIsExpired(expired);

      const expiredTasks = JSON.parse(localStorage.getItem("expiredTasks")) || {};
      expiredTasks[id] = expired;
      localStorage.setItem("expiredTasks", JSON.stringify(expiredTasks));
    }
  }, 1000);

  return () => clearInterval(interval);
}, [taskDate, id]);

useEffect(() => {
  setTaskText(text);
}, [text]);

useEffect(() => {
  setLocalGroup(group || "");
}, [group]);

const handleGroupChange = (newGroup) => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index].group = newGroup;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    setLocalGroup(newGroup);
  }
    if (typeof handleUpdateGroup === "function") {
    handleUpdateGroup(id, newGroup);
  }
};

  return(
    <form className={style.task_box} onClick={onOpenTask}>
      <TooltipPortal
        visible={tooltipVisible}
        position={{
          top: tooltipPos.top,
          left: tooltipPos.left,
          transform: 'translateX(-50%)'
        }}
      >
        {tooltipText}
      </TooltipPortal>
      <input
        type="text"
        className={`${style.input_task} ${isExpired ? style.expired_task : ""}`}
        value={taskText}
        onChange={(e) => { handleTextChange(e); e.stopPropagation(); }}
        onClick={(e) => e.stopPropagation()}
        ></input>
      <div className={style.task_buttons}>
        <div className={style.sort_buttons}>
          <button
          className={isImportant ? style.important_button_active : style.important_button}
          onClick={(e) => {refuseReload(e); toggleImportant(); e.stopPropagation()}}
          onMouseEnter={(e) => showTooltipHandler(e, 'important')}
          onMouseLeave={hideTooltipHandler}
          >
          </button>
          <button
          className={isDone ? style.done_button_active : style.done_button}
          onClick={(e) => {refuseReload(e); toggleDone(); e.stopPropagation()}}
          onMouseEnter={(e) => showTooltipHandler(e, 'done')}
          onMouseLeave={hideTooltipHandler}
          >
          </button>
          <input
          type="date"
          className={style.task_date}
          value={taskDate}
          onChange={handleDateChange}
          onClick={(e) => e.stopPropagation()}
          ></input>
          <select
            className={style.group_selector}
            value={localGroup}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => handleGroupChange(e.target.value)}
          >
            <option value="">Без группы</option>
            {Object.entries(groupColorMap).map(([key, color]) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
          <div
            className={style.task_group_marker}
            value={localGroup}
            style={{ backgroundColor: groupColorMap[localGroup] || "#ccc" }}
          ></div>
        </div>
        <button
        className={style.delete_button}
        onClick={(e) => {refuseReload(e); deleteTask(id); e.stopPropagation()}}
        onMouseEnter={(e) => showTooltipHandler(e, 'delete')}
        onMouseLeave={hideTooltipHandler}
        >
        </button>
      </div>
    </form>
  )
}

export default Task