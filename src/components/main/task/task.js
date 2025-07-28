import { useState, useEffect } from "react";
import style from "./task.module.css";
import TooltipPortal from "./tooltip/tooltip";
import DatePopover from "./datePopover";

function Task({ text, id, deleteTask, onOpenTask, onTextChange, group, handleUpdateGroup }) {

  const [isImportant, setisImportant] = useState(JSON.parse(localStorage.getItem("buttonStates"))?.[`${id}-important`] || false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [tooltipSource, setTooltipSource] = useState('');
  const [taskText, setTaskText] = useState(text);
  const [localGroup, setLocalGroup] = useState(group || "");
  const [dateMode, setDateMode] = useState("");
  const [showDatePopover, setShowDatePopover] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

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

const getOffsetIsoDate = (daysAhead) => {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + daysAhead);
  const offset = base.getTimezoneOffset() * 60000;
  const localDate = new Date(base.getTime() - offset);
  return localDate.toISOString().split("T")[0];
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
  today.setHours(0, 0, 0, 0);

  const deadline = new Date(storedDate);
  deadline.setHours(0, 0, 0, 0);

  const expired = deadline < today;
  setIsExpired(expired);
}

  const savedDateMode = localStorage.getItem(`dateMode_${id}`) || `date:${storedDate}`;
  setDateMode(savedDateMode);

  }, [id]);

const handleDateChange = (e) => {
  const newDate = typeof e === "string" ? e : e.target.value;
  setTaskDate(newDate);

  const modeValue = `date:${newDate}`;
  setDateMode(modeValue); // ← важно
  localStorage.setItem(`dateMode_${id}`, modeValue); // ← важно

  const taskDates = JSON.parse(localStorage.getItem("taskDates")) || {};
  taskDates[id] = newDate;
  localStorage.setItem("taskDates", JSON.stringify(taskDates));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(newDate);
  deadline.setHours(0, 0, 0, 0);
  const expired = deadline < today;
  setIsExpired(expired);

  const expiredTasks = JSON.parse(localStorage.getItem("expiredTasks")) || {};
  expiredTasks[id] = expired;
  localStorage.setItem("expiredTasks", JSON.stringify(expiredTasks));
};


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

const handleSmartDateChange = (value) => {
  setDateMode(value);
  localStorage.setItem(`dateMode_${id}`, value);

  if (value === "custom") {
    const selectElement = document.querySelector(`[data-select="${id}"]`);
    if (selectElement) {
      const rect = selectElement.getBoundingClientRect();
      setPopoverPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX
      });
    }
    setShowDatePopover(true);
    return;
  }

  let newDate = "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);

if (value === "today") {
  newDate = getOffsetIsoDate(0);
} else if (value === "tomorrow") {
  newDate = getOffsetIsoDate(1);
} else if (value === "nextWeek") {
  newDate = getOffsetIsoDate(7);
} else if (value === "nextMonth") {
  newDate = getOffsetIsoDate(30);
}
  setTaskDate(newDate);

  setDateMode(`date:${newDate}`);
localStorage.setItem(`dateMode_${id}`, `date:${newDate}`);

  const taskDates = JSON.parse(localStorage.getItem("taskDates")) || {};
  taskDates[id] = newDate;
  localStorage.setItem("taskDates", JSON.stringify(taskDates));

  const deadline = new Date(newDate);
  deadline.setHours(0, 0, 0, 0);
  const expired = deadline < today;
  setIsExpired(expired);

  const expiredTasks = JSON.parse(localStorage.getItem("expiredTasks")) || {};
  expiredTasks[id] = expired;
  localStorage.setItem("expiredTasks", JSON.stringify(expiredTasks));
};

const formatDateLabel = (iso) => {
  if (!iso || isNaN(new Date(iso))) return "Без даты"; // ← защита от пустой/невалидной даты
  const date = new Date(iso);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

  return(
    <form
      className={style.task_box}
        onClick={(e) => {
    if (showDatePopover) {
      e.stopPropagation();
      return;
    }
    onOpenTask();
  }}
    >
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
          <select
            className={style.task_date_select}
            data-select={id}
            value={dateMode}
            onChange={(e) => handleSmartDateChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          >
            <option value="">Без даты</option>
            <option value="today">Сегодня</option>
            <option value="tomorrow">Завтра</option>
            <option value="nextWeek">Следующая неделя</option>
            <option value="nextMonth">Следующий месяц</option>
            <option value="custom">Выбрать дату...</option>

            {dateMode.startsWith("date:") &&
  !["date:today", "date:tomorrow", "date:nextWeek", "date:nextMonth"].includes(dateMode) && (
    <option value={dateMode}>
      {formatDateLabel(taskDate)}
    </option>
)}

          </select>
          {showDatePopover && (
            <DatePopover
              position={popoverPos}
              onClose={() => setShowDatePopover(false)}
              onSelect={(newDate) => {
                handleDateChange(newDate);
              }}
            />
          )}
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