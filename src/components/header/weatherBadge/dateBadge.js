import { useEffect, useState } from "react";

import style from './weatherBadge.module.css'

function DateBadge() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const weekdays = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
  const dayName = weekdays[now.getDay()];

  const timeString = now.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

const day = now.getDate().toString().padStart(2, "0");
const month = (now.getMonth() + 1).toString().padStart(2, "0");
const year = now.getFullYear().toString().slice(-2);

const dateString = `${day}.${month}.${year}`;

  return (
    <div className={style.dateBadge}>{timeString} {dayName} {dateString}</div>
  );
}

export default DateBadge;
