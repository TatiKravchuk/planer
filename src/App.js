import { useState, useEffect } from 'react';
import './App.css';
import Add from './components/main/add/add';
import Header from './components/header/header';
import Navbar from './components/navbar/navbar';
import AllTasks from './components/main/allTasks/allTasks';
import TaskPanel from './components/taskPanel/taskPanel';

function App() {
  const [currentFilter, setCurrentFilter] = useState('all');
    const [panelOpen, setPanelOpen] = useState(false);
    const [selectedCityInfo, setSelectedCityInfo] = useState(null);
    const [weatherText, setWeatherText] = useState("");
    const [tasks, setTasks] = useState(
      JSON.parse(localStorage.getItem("tasks")) || []
    );

    useEffect(() => {
  const cached = JSON.parse(localStorage.getItem("weather_manual_cache"));
  if (cached?.text) {
    setWeatherText(cached.text);
  }
}, []);

const updateTaskText = (id, newText) => {
  if (!Array.isArray(tasks)) return;

  const updated = tasks.map(t =>
    t.id === id ? { ...t, text: newText } : t
  );
  setTasks(updated);
  localStorage.setItem("tasks", JSON.stringify(updated));
};

  return (
    <div className="App">
      <Header
        onWeatherClick={() => setPanelOpen(true)}
        selectedCityInfo={selectedCityInfo}
        weatherText={weatherText}
      />
      <div className='main'>
        <Navbar setCurrentFilter={setCurrentFilter} />
        <main className="main_box">
          <Add />
          <AllTasks
            currentFilter={currentFilter}
            tasks={tasks}
            updateTaskText={updateTaskText}
            setTasks={setTasks}
          />
        </main>
        <TaskPanel
          visible={panelOpen}
          onClose={() => setPanelOpen(false)}
          selectedCityInfo={selectedCityInfo}
          setSelectedCityInfo={setSelectedCityInfo}
          setWeatherText={setWeatherText}
          tasks={tasks}
          setTasks={setTasks}
          updateTaskText={updateTaskText}
        />
      </div>
    </div>
  );
}

export default App;