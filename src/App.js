import { useState } from 'react';
import './App.css';
import Add from './components/main/add/add';
import Header from './components/header/header';
import Navbar from './components/navbar/navbar';
import AllTasks from './components/main/allTasks/allTasks';

function App() {
  const [currentFilter, setCurrentFilter] = useState('all');

  return (
    <div className="App">
      <Header />
      <div className='main'>
        <Navbar setCurrentFilter={setCurrentFilter} />
        <main className="main_box">
          <Add />
          <AllTasks currentFilter={currentFilter} />
        </main>
      </div>
    </div>
  );
}

export default App;