import ReactDOM from "react-dom";
import style from "./datePopover.module.css";

function DatePopover({ position, onClose, onSelect }) {
  return ReactDOM.createPortal(
    <div className={style.popover} style={{ top: position.top, left: position.left }}>
      <input
        type="date"
        onChange={(e) => {
          onSelect(e.target.value);
          onClose();
        }}
        autoFocus
        className={style.date_input}
      />
    </div>,
    document.body
  );
}

export default DatePopover;
