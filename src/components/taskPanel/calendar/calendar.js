import Calendar from "react-calendar";
import style from "./calendar.module.css"
import "./calendar.css"
import "react-calendar/dist/Calendar.css";
import { useState } from "react";

function PlannerCalendar({ onSelectDate }) {
  const [value, setValue] = useState(new Date());

function hasTasksOnDate(date) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskDates = JSON.parse(localStorage.getItem("taskDates")) || {};

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const current = `${year}-${month}-${day}`;

  return tasks.some(task => taskDates[task.id] === current);
}


  return (
    <div>
      <Calendar
        onChange={(date) => {
          setValue(date)
          onSelectDate && onSelectDate(date)
        }}
        value={value}
        locale="ru-RU"
          tileClassName={({ date, view }) =>
            view === "month" && hasTasksOnDate(date) ? style.marked : null
          }
          tileContent={({ date, view }) =>
            view === "month" && hasTasksOnDate(date) ? (
              <div className={style.dot}></div>
            ) : null
          }
      />
    </div>
  );
}

export default PlannerCalendar;
