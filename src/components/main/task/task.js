import { useState, useEffect } from "react";
import style from "./task.module.css"

function Task(props) {

  const [isImportant, setisImportant] = useState(JSON.parse(localStorage.getItem("buttonStates"))?.[`${props.id}-important`] || false);

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

  return(
    <form className={style.task_box}>
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
          >
            <span className={style.tooltip_text}>Сделать задачу важной</span>
          </button>
          <button
          className={isDone ? style.done_button_active : style.done_button}
          onClick={(e) => {refuseReload(e); toggleDone()}}
          >
            <span className={style.tooltip_text}>Выполнить задачу</span>
          </button>
          <input
          type="date"
          className={style.task_date}
          value={taskDate}
          onChange={handleDateChange}
          ></input>
        </div>
        <button className={style.delete_button} onClick={(e) => {refuseReload(e); props.deleteTask(props.id)}}>
          <span className={style.tooltip_text}>Удалить задачу</span>
        </button>
      </div>
    </form>
  )
}

export default Task