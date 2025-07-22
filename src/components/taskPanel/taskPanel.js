import { useState, useEffect, useRef } from "react";
import style from "./taskPanel.module.css";

import PlannerCalendar from "./calendar/calendar";
import TaskInfoPanel from "../taskInfoPanel/taskInfoPanel";
import WeatherBadgeManual from "../header/weatherBadge/weatherBadgeManual";
import CitySelector from "../header/weatherBadge/citySelector";

function TaskPanel({ visible, onClose, selectedCity, selectedCityInfo, setSelectedCityInfo, setWeatherText, tasks, setTasks, updateTaskText }) {
const panelRef = useRef(null);

const [selectedDate, setSelectedDate] = useState(new Date());
const [tasksForDate, setTasksForDate] = useState([]);

const [theme, setTheme] = useState("default");
const [openedTaskId, setOpenedTaskId] = useState(null);

const [cachedWeatherText, setCachedWeatherText] = useState("");

const cityLabel = selectedCityInfo?.name || "";

const [calendarMonthDate, setCalendarMonthDate] = useState(new Date());

const handleThemeChange = (e) => {
  const selected = e.target.value;
  setTheme(selected);
  document.body.setAttribute("data-theme", selected);
  localStorage.setItem("selectedTheme", selected);
};

useEffect(() => {
  const savedTheme = localStorage.getItem("selectedTheme") || "default";
  setTheme(savedTheme);
  document.body.setAttribute("data-theme", savedTheme);
}, []);

  useEffect(() => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskDates = JSON.parse(localStorage.getItem("taskDates")) || {};

  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const day = String(selectedDate.getDate()).padStart(2, "0");
  const chosen = `${year}-${month}-${day}`;

  const filtered = tasks.filter(task => taskDates[task.id] === chosen);
  setTasksForDate(filtered);
}, [selectedDate, tasks]);

const showPanel = visible && !openedTaskId;

useEffect(() => {
  const storedWeather = localStorage.getItem("currentWeatherText");
  if (storedWeather) {
    setCachedWeatherText(storedWeather);
  }
}, [visible]);

useEffect(() => {
  const savedCity = localStorage.getItem("selectedCity");
  if (savedCity && !selectedCityInfo) {
    setSelectedCityInfo({ name: savedCity });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedCityInfo]);

useEffect(() => {
  function handleClickOutside(event) {
    if (visible && panelRef.current && !panelRef.current.contains(event.target)) {
      onClose();
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [visible, onClose]);

function hasSixWeeks(date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const adjustedStart = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return Math.ceil((adjustedStart + daysInMonth) / 7) > 5;
}

return (
  <>
    {showPanel && (
      <div ref={panelRef} className={`${style.panel} ${visible ? style.open : ""}`}>
        <button className={style.close} onClick={onClose}>✖</button>
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
        <div className={style.content}>
          <div className={style.calendar}>
            <PlannerCalendar
              onSelectDate={setSelectedDate}
              onActiveStartDateChange={({ activeStartDate }) => setCalendarMonthDate(activeStartDate)}
            />
          </div>
          <div className={style.weatherStatic}>
            <p>{cachedWeatherText}</p>
          </div>
          <WeatherBadgeManual city={cityLabel} className="in-task-panel" onWeatherText={setWeatherText} />
          <CitySelector
          onSelect={(city) => {
            setSelectedCityInfo(city);
            localStorage.setItem("selectedCity", city.name);}}
          />
          <div className={style.events}>
            <h3 className={style.events_title}>Задачи на {selectedDate.toLocaleDateString("ru-RU")}</h3>
            {tasksForDate.length === 0 ? (
              <p>Нет задач на выбранную дату</p>
            ) : (
              <ul
                className={`${style.events_ul}
                ${hasSixWeeks(calendarMonthDate)
                ? style.events_extra_height
                : style.events_normal_height}`}
              >
                {tasksForDate.map(task => (
                  <li key={task.id} onClick={() => setOpenedTaskId(task.id)}>
                    {task.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
      </div>
        </div>
    )}

    <TaskInfoPanel
      taskId={openedTaskId}
      visible={!!openedTaskId}
      onClose={() => setOpenedTaskId(null)}
      updateTaskText={updateTaskText}
    />
  </>
);

}

export default TaskPanel;
