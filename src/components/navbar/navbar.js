import style from "./navbar.module.css";

import { useState } from "react";

function Navbar({ setCurrentFilter }) {

  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (item) => {
    setActiveItem(item);
    setCurrentFilter(item);
    if (window.innerWidth <= 640) {
      setWasCollapsed(false);
      setCollapsed(true);
  }};

  const [collapsed, setCollapsed] = useState(window.innerWidth <= 640);
  const [wasCollapsed, setWasCollapsed] = useState(false);

  const toggleMenu = () => {
    setWasCollapsed(collapsed);
    setCollapsed(!collapsed);
  };

  return(
    <nav className={collapsed ? style.navbar_collapsed : style.navbar}>
      <button className={style.navbutton} onClick={toggleMenu}></button>
      <ul className={style.navlist}>
        <li
          className={`${activeItem === "all" ? style.navitem_active : style.navitem}
          ${style.navall}`}
          onClick={() => {
            handleClick("all");
          }}>
          {collapsed ? null : <span
          className={wasCollapsed ? style.item_text : style.appear_instantly}
          >Все задачи</span>}
        </li>
        <li
          className={`${activeItem === "current" ? style.navitem_active : style.navitem}
          ${style.navcurrent}`}
          onClick={() => {
            handleClick("current");
          }}>
          {collapsed ? null : <span
          className={wasCollapsed ? style.item_text : style.appear_instantly}
          >Текущие задачи</span>}
        </li>
        <li
          className={`${activeItem === "today" ? style.navitem_active : style.navitem}
          ${style.navtoday}`}
          onClick={() => {
            handleClick("today");
          }}>
          {collapsed ? null : <span
          className={wasCollapsed ? style.item_text : style.appear_instantly}
          >Задачи на сегодня</span>}
        </li>
        <li
          className={`${activeItem === "important" ? style.navitem_active : style.navitem}
          ${style.navimportant}`}
          onClick={() => {
            handleClick("important");
          }}>
          {collapsed ? null : <span
          className={wasCollapsed ? style.item_text : style.appear_instantly}
          >Важные задачи</span>}
        </li>
        <li
          className={`${activeItem === "completed" ? style.navitem_active : style.navitem}
          ${style.navcompleted}`}
          onClick={() => {
            handleClick("completed");
          }}>
          {collapsed ? null : <span
          className={wasCollapsed ? style.item_text : style.appear_instantly}
          >Завершенные задачи</span>}
        </li>
      </ul>
    </nav>
  )
}

export default Navbar