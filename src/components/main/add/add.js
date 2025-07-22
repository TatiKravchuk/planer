import style from "./add.module.css"

import { useState } from "react";

function Add({ list, setList }) {

    const [selectedGroup, setSelectedGroup] = useState("");

  function saveTask() {

    const newTaskText = document.getElementById("userTask").value;
    if (!newTaskText.trim()) return;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const newTask = {
      id: Date.now(),
      text: newTaskText,
      group: selectedGroup
    }

    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    setList(tasks);

    document.getElementById("userTask").value = "";

  }

  function refuseReload(e) {
    e.preventDefault();
  }

  const groups = [
  { id: "work", color: "#007bff" },
  { id: "personal", color: "#f06292" },
  { id: "study", color: "#ffa000" },
  { id: "health", color: "#4caf50" },
  { id: "finance", color: "#00bcd4" },
  { id: "events", color: "#e91e63" },
  { id: "travel", color: "#673ab7" },
  { id: "home", color: "#795548" }
];



  return(
    <form className={style.current}>
      <input className={style.input_add} type="text" placeholder="Текст задачи" id="userTask"></input>
      <div className={style.buttons_for_task}>
        <div className={style.buttons_add}>
          <button className={style.button_add} type="submit" onClick={(e) => {saveTask(); refuseReload(e)}}>Добавить задачу</button>
          <button
            className={style.button_delete}
            onClick={(e) => {
              localStorage.removeItem("tasks");
              localStorage.removeItem("taskDates");
              localStorage.removeItem("buttonStates");
              localStorage.removeItem("expiredTasks");
              setList([]);
              refuseReload(e);
            }}
          >
            Удалить все задачи
          </button>
        </div>
        <div className={style.sort_buttons_add}>
          <div className={style.group_picker}>
          <label htmlFor="groupSelect" className={style.group_circle} style={{
          backgroundColor: groups.find(g => g.id === selectedGroup)?.color || "#ccc"
          }}></label>
          <select
            id="groupSelect"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Без группы</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.id}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
    </form>
  )
}

export default Add