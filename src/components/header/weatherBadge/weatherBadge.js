import style from './weatherBadge.module.css';
import { useEffect, useState } from "react";

function WeatherBadge({ city, onClick }) {
  const [text, setText] = useState("Загрузка...");

  function shouldUpdateWeather() {
    const saved = JSON.parse(localStorage.getItem("weatherCache"));
    const now = new Date();
    const currentHour = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());

    if (!saved || !saved.time) return true;

    const savedTime = new Date(saved.time);
    return savedTime.getTime() !== currentHour.getTime();
  }

  function fetchWeather(city, setText) {
    fetch(`https://wttr.in/${encodeURIComponent(city)}?format=3&m&lang=ru`)
      .then(res => res.text())
      .then(text => {
        const now = new Date();
        const hourStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
        localStorage.setItem("weatherCache", JSON.stringify({ time: hourStart.toISOString(), text }));
        setText(text);
      })
      .catch(() => setText("Ошибка загрузки погоды"));
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("weatherCache"));

    if (shouldUpdateWeather()) {
      fetchWeather(city, setText);
    } else if (saved && saved.text) {
      setText(saved.text);
    } else {
      fetchWeather(city, setText);
    }
  }, [city]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible" && shouldUpdateWeather()) {
        fetchWeather(city, setText);
      }
    }, 60000);

    return () => clearInterval(timer);
  }, [city]);

  return (
    <div className={style.weatherBadge} onClick={onClick}>
      {text}
    </div>
  );
}

export default WeatherBadge;
