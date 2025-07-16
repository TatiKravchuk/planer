import style from './weatherBadge.module.css';
import { useEffect, useState } from "react";

function WeatherBadge({ onClick }) {
  const [city, setCity] = useState("");
  const [text, setText] = useState("Загрузка...");

  useEffect(() => {
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      const detectedCity = data.city || "";
      setCity(detectedCity);
    })
    .catch(() => {
      setCity("");
    });
}, []);

function shouldUpdateWeather(intervalMinutes = 60) {
  localStorage.removeItem("weatherCache");

  const saved = JSON.parse(localStorage.getItem("weatherCache"));
  const now = Date.now();

  if (!saved || !saved.time) return true;

  return now - saved.time >= intervalMinutes * 60 * 1000;
}

  function fetchWeather(city, setText) {
    fetch(`https://wttr.in/${encodeURIComponent(city)}?format=3&m&lang=ru`)
      .then(res => res.text())
      .then(text => {
        localStorage.setItem("weatherCache", JSON.stringify({
          time: Date.now(),
          text
        }));
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
  function tryUpdate() {
    if (document.visibilityState === "visible" && shouldUpdateWeather()) {
      fetchWeather(city, setText);
    }
  }

  const timer = setInterval(tryUpdate, 60 * 60 * 1000);

  document.addEventListener("visibilitychange", tryUpdate);

  tryUpdate();

  return () => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", tryUpdate);
  };
}, [city]);


  return (
    <div className={style.weatherBadge} onClick={onClick}>
      {text}
    </div>
  );
}

export default WeatherBadge;
