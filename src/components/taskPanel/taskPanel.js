import { useState, useEffect, useRef } from "react";
import style from "./taskPanel.module.css";

import PlannerCalendar from "./calendar/calendar";

function TaskPanel({ visible, onClose, selectedCity }) {
  const panelRef = useRef(null);

const [selectedDate, setSelectedDate] = useState(new Date());
const [tasksForDate, setTasksForDate] = useState([]);

const [theme, setTheme] = useState("default");

const handleThemeChange = (e) => {
  const selected = e.target.value;
  setTheme(selected);
  document.body.setAttribute("data-theme", selected);
};

  useEffect(() => {
    function handleClickOutside(event) {
      if (visible && panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, onClose]);

  useEffect(() => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskDates = JSON.parse(localStorage.getItem("taskDates")) || {};

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const chosen = `${year}-${month}-${day}`;

  const filtered = tasks.filter(task => taskDates[task.id] === chosen);
  setTasksForDate(filtered);
}, [selectedDate]);

  return (
    <div ref={panelRef} className={`${style.panel} ${visible ? style.open : ""}`}>
      <button className={style.close} onClick={onClose}>✖</button>

      <div className={style.content}>
        <div className={style.calendar}><PlannerCalendar onSelectDate={setSelectedDate} /></div>
        <div className={style.events}>
          <h3>Задачи на {selectedDate.toLocaleDateString("ru-RU")}</h3>
          {tasksForDate.length === 0 ? (
            <p>Нет задач на выбранную дату</p>
          ) : (
            <ul>
              {tasksForDate.map(task => (
                <li key={task.id}>{task.text}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className={style.themeSelector}>
  <label htmlFor="theme">Изменить тему:</label>
  <select id="theme" value={theme} onChange={handleThemeChange}>
    <option value="default">Деловой</option>
    <option value="dark">Ночной</option>
    <option value="brown">Кофе</option>
    <option value="orange">Закат</option>
    <option value="pink">Принцесса</option>
  </select>
</div>

    </div>
  );
}

export default TaskPanel;
