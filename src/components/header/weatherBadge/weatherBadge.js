import { useEffect, useState } from "react";
import style from "./weatherBadge.module.css";

function WeatherBadge({ onClick, className }) {
  const [city, setCity] = useState("");
  const [text, setText] = useState("Загрузка...");

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(res => res.json())
      .then(data => {
        const detectedCity = data.city || "";
        setCity(detectedCity);
      })
      .catch(() => setCity(""));
  }, []);

  useEffect(() => {
    if (!city) return;

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&language=ru&count=1`)
      .then(res => res.json())
      .then(data => {
        const found = data.results?.[0];
        if (!found) throw new Error("Город не найден");

        const { latitude, longitude } = found;
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      })
          .then(res => res.json())
          .then(data => {
            const weather = data.current_weather;
            if (weather) {
              const display = `🌡 ${weather.temperature}°C, 🌬 ${weather.windspeed} км/ч`;
              const finalText = `${city}: ${display}`;
              setText(finalText);

              localStorage.setItem("currentWeatherText", finalText);
            } else {
              setText("Нет данных о погоде");
            }
          })

      .catch(() => setText("Ошибка загрузки погоды"));
  }, [city]);

  return (
    <div className={`${style.weatherBadge} ${style[className] || className}`} onClick={onClick}>
      {text}
    </div>
  );
}

export default WeatherBadge;
