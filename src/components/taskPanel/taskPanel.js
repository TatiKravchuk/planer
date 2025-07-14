import { useEffect, useRef } from "react";
import style from "./taskPanel.module.css";

import Calendar from "./calendar/calendar";

function TaskPanel({ visible, onClose, selectedCity }) {
  const panelRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (visible && panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [visible, onClose]);

  return (
    <div ref={panelRef} className={`${style.panel} ${visible ? style.open : ""}`}>
      <button className={style.close} onClick={onClose}>✖</button>

      <div className={style.content}>
        <div className={style.calendar}><Calendar /></div>
        <div className={style.info}>События: {selectedCity}</div>
      </div>
    </div>
  );
}

export default TaskPanel;
