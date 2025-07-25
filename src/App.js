import { HashRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css';

import Add from './components/main/add/add';
import Header from './components/header/header';
import Navbar from './components/navbar/navbar';
import AllTasks from './components/main/allTasks/allTasks';
import TaskPanel from './components/taskPanel/taskPanel';
import Sapper from './components/sapper/sapper';
import Calculator from "./components/calculator/calculator";

function MainApp() {
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
          <Add list={tasks} setList={setTasks} />
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

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/sapper" element={<Sapper />} />
        <Route path="/calculator" element={<Calculator />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
