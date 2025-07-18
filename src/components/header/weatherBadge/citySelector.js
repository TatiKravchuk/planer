import { useState } from "react";
import style from "./weatherBadge.module.css"

function CitySelector({ onSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&language=ru&count=10`)
      .then(res => res.json())
      .then(data => {
        setResults(data.results || []);
        setVisible(true);
        setLoading(false);
      })
      .catch(() => {
        setResults([]);
        setVisible(true);
        setLoading(false);
      });
  };

  return (
    <div className={style.selector_wrapper}>
      <label htmlFor="city"></label>
      <input
        id="city"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Введите название города"
        className={style.city_input}
      />
      <button onClick={handleSearch} className={style.city_search}></button>

      {loading && <p>Загрузка...</p>}

      {visible && results.length > 0 && (
        <ul className={style.city_option}>
          {results.map(city => (
            <li key={city.id} onClick={() => {
              onSelect(city);
              setVisible(false);
              setQuery(city.name);
            }}>
              {city.name}, {city.admin1}, {city.country}
            </li>
          ))}
        </ul>
      )}

      {visible && results.length === 0 && !loading && (
        <p>Город не найден</p>
      )}
    </div>
  );
}

export default CitySelector;
