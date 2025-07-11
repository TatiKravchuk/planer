import { useState, useEffect } from "react";
import style from "./task.module.css";
import TooltipPortal from "./tooltip";

function Task(props) {

  const [isImportant, setisImportant] = useState(JSON.parse(localStorage.getItem("buttonStates"))?.[`${props.id}-important`] || false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [tooltipSource, setTooltipSource] = useState('');

  useEffect(() => {
  const buttonStates = JSON.parse(localStorage.getItem("buttonStates")) || {};
  buttonStates[`${props.id}-important`] = isImportant;
  localStorage.setItem("buttonStates", JSON.stringify(buttonStates));
  }, [isImportant, props.id]);

  const toggleImportant = () => {
    setisImportant(!isImportant);
  };

  const [isDone, setIsDone] = useState(
  JSON.parse(localStorage.getItem("buttonStates"))?.[`${props.id}-done`] || false
  );

  useEffect(() => {
    const buttonStates = JSON.parse(localStorage.getItem("buttonStates")) || {};
    buttonStates[`${props.id}-done`] = isDone;
    localStorage.setItem("buttonStates", JSON.stringify(buttonStates));
  }, [isDone, props.id]);

  const toggleDone = () => {
    setIsDone(!isDone);
  };

  const [taskDate, setTaskDate] = useState(
    JSON.parse(localStorage.getItem("taskDates"))?.[props.id] || ""
  );

  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
  const taskDates = JSON.parse(localStorage.getItem("taskDates")) || {};
  const storedDate = taskDates[props.id] || "";
  setTaskDate(storedDate);

  if (storedDate) {
    const today = new Date();
    today.setTime(today.getTime() - 86400000);
    const deadline = new Date(storedDate);
    setIsExpired(deadline > today);
  }

  }, [props.id]);

  const handleDateChange = (event) => {
  const newDate = event.target.value;
  setTaskDate(newDate);

  const taskDates = JSON.parse(localStorage.getItem("taskDates")) || {};
  taskDates[props.id] = newDate;
  localStorage.setItem("taskDates", JSON.stringify(taskDates));

  const today = new Date();
  today.setTime(today.getTime() - 86400000);
  const taskDeadline = new Date(newDate);
  const expiredStatus = taskDeadline < today;

  setIsExpired(expiredStatus);

  const expiredTasks = JSON.parse(localStorage.getItem("expiredTasks")) || {};
  expiredTasks[props.id] = expiredStatus;
  localStorage.setItem("expiredTasks", JSON.stringify(expiredTasks));
  };

  useEffect(() => {
  const expiredTasks = JSON.parse(localStorage.getItem("expiredTasks")) || {};
  setIsExpired(expiredTasks[props.id] || false);
  }, [props.id]);


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
      expiredTasks[props.id] = expired;
      localStorage.setItem("expiredTasks", JSON.stringify(expiredTasks));
    }
  }, 1000);

  return () => clearInterval(interval);
}, [taskDate, props.id]);

  return(
    <form className={style.task_box}>
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
        value={props.text}
        readOnly
        ></input>
      <div className={style.task_buttons}>
        <div className={style.sort_buttons}>
          <button
          className={isImportant ? style.important_button_active : style.important_button}
          onClick={(e) => {refuseReload(e); toggleImportant()}}
          id={props.idImportant}
          onMouseEnter={(e) => showTooltipHandler(e, 'important')}
          onMouseLeave={hideTooltipHandler}
          >
          </button>
          <button
          className={isDone ? style.done_button_active : style.done_button}
          onClick={(e) => {refuseReload(e); toggleDone()}}
          onMouseEnter={(e) => showTooltipHandler(e, 'done')}
          onMouseLeave={hideTooltipHandler}
          >
          </button>
          <input
          type="date"
          className={style.task_date}
          value={taskDate}
          onChange={handleDateChange}
          ></input>
        </div>
        <button
        className={style.delete_button}
        onClick={(e) => {refuseReload(e); props.deleteTask(props.id)}}
        onMouseEnter={(e) => showTooltipHandler(e, 'delete')}
        onMouseLeave={hideTooltipHandler}
        >
        </button>
      </div>
    </form>
  )
}

export default Task