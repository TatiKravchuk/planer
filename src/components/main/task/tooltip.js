import { createPortal } from 'react-dom';
import style from "./tooltip.module.css"

const TooltipPortal = ({ children, visible, position }) => {
  if (!visible) return null;

  return createPortal(
    <div className={style.tooltip} style={position}>
      {children}
    </div>,
    document.body
  );
};

export default TooltipPortal;
