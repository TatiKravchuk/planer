import style from "./navbar.module.css";

import { useState, useEffect, useRef } from "react";

function Navbar({ setCurrentFilter }) {

  const [activeItem, setActiveItem] = useState(null);

  const handleClick = (item) => {
    setActiveItem(item);
    setCurrentFilter(item);
    if (window.matchMedia("(max-width: 640px)").matches) {
      setWasCollapsed(false);
      setCollapsed(true);
  }};

  const [collapsed, setCollapsed] = useState(window.innerWidth <= 640);
  const [wasCollapsed, setWasCollapsed] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const [showEntertainment, setShowEntertainment] = useState(false);

  const toggleMenu = () => {
    setWasCollapsed(collapsed);
    setCollapsed(!collapsed);
  };

  const extraRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (e) => {
    if (extraRef.current && !extraRef.current.contains(e.target)) {
      setShowExtras(false);
      setShowEntertainment(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

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
      <div className={style.extra_box} ref={extraRef}>
        <button
        className={style.extrabtn}
        onClick={() => {
          const closing = showExtras;
          setShowExtras(prev => !prev);
          if (closing) {
            setShowEntertainment(false);
          }
        }}
        >
          {collapsed
          ? <span className={style.extrabtn_icon}></span>
          : <span
          className={wasCollapsed ? style.button_text : style.appear_instantly}
          >Дополнительно</span>}
        </button>
        {showExtras && (
        <ul
        className={`${style.nav_extralist} ${showExtras ? style.show : style.hide}`}
        >
          {/* <li>Календарь</li>
          <li>Книга контактов</li>
          <li>Погода</li>
          <li>Книга рецептов</li>
          <li>Дневник</li>
          <li>Калькуятор</li> */}
          <li
            onClick={() => setShowEntertainment(prev => !prev)}
            className={style.entertainments}
          >
            Развлечения
            {showEntertainment && (
              <ul className={style.entertainments_list}>
                <li
                onClick={() => window.open('https://play.google.com/store/apps/details?id=com.RoyalLily.FlowerShop&hl=ru')}
                className={style.flowershop}
                >
                  Flower Shop</li>
              </ul>
            )}
          </li>
        </ul>
        )}
      </div>
    </nav>
  )
}

export default Navbar