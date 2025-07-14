import { useState } from 'react';
import './App.css';
import Add from './components/main/add/add';
import Header from './components/header/header';
import Navbar from './components/navbar/navbar';
import AllTasks from './components/main/allTasks/allTasks';
import TaskPanel from './components/taskPanel/taskPanel';

function App() {
  const [currentFilter, setCurrentFilter] = useState('all');
    const [panelOpen, setPanelOpen] = useState(false);

  return (
    <div className="App">
      <Header onWeatherClick={() => setPanelOpen(true)}/>
      <div className='main'>
        <Navbar setCurrentFilter={setCurrentFilter} />
        <main className="main_box">
          <Add />
          <AllTasks currentFilter={currentFilter} />
        </main>
        <TaskPanel
          visible={panelOpen}
          onClose={() => setPanelOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;