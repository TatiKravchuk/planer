import style from "./header.module.css"

// import CitySelector from "./weatherBadge/citySelector";
// import { useState } from "react";

import WeatherBadge from "./weatherBadge/weatherBadge"
import DateBadge from "./weatherBadge/dateBadge"

function Header() {

  // const [selectedCity, setSelectedCity] = useState(null);

return (
  <header className={style.header}>
    <h1 className={style.title}>Планер</h1>
    <div className={style.weatherbadge}>
      <WeatherBadge city="" />
        {/* {selectedCity && (
          <div>
            🏠{selectedCity.name}, {selectedCity.country}
          </div>
        )}
      <CitySelector onSelect={setSelectedCity} /> */}
      <DateBadge />
    </div>
  </header>
)
}

export default Header