import style from "./navbar.module.css";

import { useState } from "react";

function Navbar({ setCurrentFilter, currentFilter }) {

  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (item) => {
    setActiveItem(item);
  };

  return(
<nav className={style.navbar}>
      <ul className={style.navlist}>
        <li
          className={activeItem === "all" ? style.navitem_active : style.navitem}
          onClick={() => {setCurrentFilter('all'); handleClick("all")}}
        >
          Все задачи
        </li>
        <li
          className={activeItem === "current" ? style.navitem_active : style.navitem}
          onClick={() => {setCurrentFilter('current'); handleClick("current")}}
        >
          Текущие задачи
        </li>
        <li
          className={activeItem === "today" ? style.navitem_active : style.navitem}
          onClick={() => {setCurrentFilter('today'); handleClick("today")}}
        >
          Задачи на сегодня
        </li>
        <li
          className={activeItem === "important" ? style.navitem_active : style.navitem}
          onClick={() => {setCurrentFilter('important'); handleClick("important")}}
        >
          Важные задачи
        </li>
        <li
          className={activeItem === "completed" ? style.navitem_active : style.navitem}
          onClick={() => {setCurrentFilter('completed'); handleClick("completed")}}
        >
          Завершенные задачи
        </li>
      </ul>
    </nav>
  )
}

export default Navbar