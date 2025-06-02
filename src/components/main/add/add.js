import style from "./add.module.css"

function Add({ list, setList }) {

  function saveTask() {
    let newTaskText = document.getElementById("userTask").value;
    if (!newTaskText.trim()) return;

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let newTask = {
      id: Date.now(),
      text: newTaskText,
    }
    tasks.push(newTask);

    localStorage.setItem("tasks", JSON.stringify(tasks));

    document.getElementById("userTask").value = "";
  }

  function refuseReload(e) {
    e.preventDefault();
  }

  return(
    <form className={style.current}>
      <input className={style.input_add} type="text" placeholder="Текст задачи" id="userTask"></input>
      <button className={style.button_add} type="submit" onClick={(e) => {saveTask(); refuseReload(e)}}>Добавить задачу</button>
      <button className={style.button_delete} onClick={(e) => {localStorage.clear(); refuseReload(e)}}>Удалить все задачи</button>
    </form>
  )
}

export default Add