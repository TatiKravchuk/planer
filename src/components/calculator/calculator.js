import { useState, useEffect } from "react";
import { evaluate } from "mathjs";

import calculatorIcon from "../assets/images/calculator.png"

import style from"./calculator.module.css";

const buttons = [
  { value: "7", className: "number" },
  { value: "8", className: "number" },
  { value: "9", className: "number" },
  { value: "/", className: "math" },
  { value: "sin", className: "trig" },
  { value: "4", className: "number" },
  { value: "5", className: "number" },
  { value: "6", className: "number" },
  { value: "*", className: "math" },
  { value: "cos", className: "trig" },
  { value: "1", className: "number" },
  { value: "2", className: "number" },
  { value: "3", className: "number" },
  { value: "-", className: "math" },
  { value: "tg", className: "trig" },
  { value: "0", className: "number" },
  { value: ".", className: "number" },
  { value: "=", className: "equal" },
  { value: "+", className: "math" },
  { value: "ctg", className: "trig" },
  { value: "(", className: "math" },
  { value: ")", className: "math" },
  { value: "% от", className: "math" },
  { value: "^", className: "math" },
  { value: "√", className: "math" }
];

const Calculator = () => {
  const [input, setInput] = useState("");

  useEffect(() => {
  document.title = "Калькулятор";

  const oldLink = document.querySelector("link[rel='icon']");
  if (oldLink) document.head.removeChild(oldLink);

  const newLink = document.createElement("link");
  newLink.rel = "icon";
  newLink.type = "image/png";
  newLink.href = calculatorIcon;
  document.head.appendChild(newLink);

  return () => {
    document.head.removeChild(newLink);
  };
}, []);

  const handleClick = (value) => {
    setInput((prev) => {
      if (prev === "Ошибка") {
        setIsError(false);
        return value;
      }

      if (value === "=") {
        calculateResult();
        return prev;
      }

      if (value === "% от") {
        return prev + " % от ";
      }

      if (value === "√") {
        return prev.match(/\d$/) ? prev + "√" : prev + "2√";
      }

      if (value === "←") {
        return prev.slice(0, -1);
      }

      return prev + value;
    });
  };

  const [isError, setIsError] = useState(false);

  const calculateResult = () => {
    try {
      let expression = input
        .replace(/(\d+)\s*√\s*(\d+)/g, "nthRoot($2, $1)")
        .replace(/(\d+)\^(\d+)/g, "pow($1, $2)")
        .replace(/log\((\d+)\)/g, "log($1, 10)")
        .replace(/(\d+)\s*°/g, "($1 * PI / 180)")
        .replace(/\btg\(([^)]+)\)/g, "tan($1 * PI / 180)")
        .replace(/\bctg\(([^)]+)\)/g, "(1 / tan($1 * PI / 180))")
        .replace(/sin\(([^)]+)\)/g, "sin($1 * PI / 180)")
        .replace(/cos\(([^)]+)\)/g, "cos($1 * PI / 180)")
        .replace(/(\d+)\s*% от (\d+)/g, "($2 * ($1 / 100))");

        let result = evaluate(expression);

        if (Math.abs(result) > 1e10) {
          throw new Error("Некорректное значение tg(x), стремится к бесконечности!");
        }

        setInput(Number(result.toFixed(10)));
        setIsError(false);
      } catch (error) {
        console.error("Ошибка:", error.message);
        setInput("Ошибка");
        setIsError(true);
      }
    };

  const clearInput = () => {
    setInput("");
    setIsError(false);
  };

  const handleKeyDown = (event) => {
    const { key } = event;

    if (key === "Enter") {
      calculateResult();
      return;
    }

    if (key === "Backspace") {
      setInput((prev) => prev.slice(0, -1));
      return;
    }

    if (/[\d+\-*/().%√]/.test(key)) {
      setInput((prev) => prev + key);
    }
  };

  return (
    <div className={style.calculator}>
      <input
        type="text"
        value={input}
        className={isError ? style.calculator_input_error : style.calculator_input}
        onKeyDown={handleKeyDown}
        readOnly
        />
      <div className={style.calculator_buttons}>
      {buttons.map(({ value, className }) => (
        <button
          key={value}
          onClick={() => handleClick(value)}
          className={`${style.calculator_button} ${style[`calculator_button_${className}`]}`}>
          {value}
        </button>
        ))}
          <div className={style.calculator_extra_buttons}>
            <button className={style.calculator_extra_button} onClick={() => handleClick("←")}>←</button>
            <button className={style.calculator_extra_button} onClick={clearInput}>C</button>
          </div>
      </div>
    </div>
  );
};

export default Calculator;
