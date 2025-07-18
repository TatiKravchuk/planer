import { useEffect, useState } from "react";
import style from "./weatherBadge.module.css";

function WeatherBadgeManual({ city: incomingCity, onClick, className, onWeatherText }) {
  const [text, setText] = useState("Загрузка...");
  const [resolvedCity, setResolvedCity] = useState("");

  useEffect(() => {
    if (incomingCity) {
      setResolvedCity(incomingCity);
      return;
    }

    const savedCity = localStorage.getItem("selectedCity");
    if (savedCity) setResolvedCity(savedCity);
  }, [incomingCity]);

  useEffect(() => {
    if (!resolvedCity) return;

    const key = "weather_manual_cache";
    const saved = JSON.parse(localStorage.getItem(key));
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    const isCurrent = saved?.city === resolvedCity && (now - saved.time < oneHour);

    if (isCurrent) {
      setText(saved.text);
      if (onWeatherText) onWeatherText(saved.text);
      return;
    }

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(resolvedCity)}&language=ru&count=1`)
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
          const fullText = `${resolvedCity}: ${display}`;
          setText(fullText);
          if (onWeatherText) onWeatherText(fullText);

          localStorage.setItem(key, JSON.stringify({
            city: resolvedCity,
            text: fullText,
            time: now
          }));
        } else {
          setText("Нет данных о погоде");
        }
      })
      .catch(() => setText("Ошибка загрузки погоды"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedCity]);

return (
  <div className={`${style.weatherBadge} ${style[className] || className}`} onClick={onClick}>
    {text}
  </div>
);
}

export default WeatherBadgeManual;