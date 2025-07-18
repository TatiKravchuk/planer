import style from "./header.module.css"

import WeatherBadge from "./weatherBadge/weatherBadge"
import DateBadge from "./weatherBadge/dateBadge"

function Header({ onWeatherClick, selectedCityInfo, weatherText }) {

return (
  <header className={style.header}>
    <h1 className={style.title}>Планер</h1>
    <div className={style.weatherbadge} onClick={onWeatherClick}>
      <WeatherBadge city="" />
      <div className={style.weatherStatic}>
        <p>{weatherText || "Выберите город"}</p>
      </div>
      <DateBadge />
    </div>
  </header>
)
}

export default Header