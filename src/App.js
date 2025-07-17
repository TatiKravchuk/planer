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

    useEffect(() => {
  const cached = JSON.parse(localStorage.getItem("weather_manual_cache"));
  if (cached?.text) {
    setWeatherText(cached.text);
  }
}, []);

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
          <AllTasks currentFilter={currentFilter} />
        </main>
        <TaskPanel
          visible={panelOpen}
          onClose={() => setPanelOpen(false)}
            selectedCityInfo={selectedCityInfo}
            setSelectedCityInfo={setSelectedCityInfo}
            setWeatherText={setWeatherText}
        />
      </div>
    </div>
  );
}

export default App;