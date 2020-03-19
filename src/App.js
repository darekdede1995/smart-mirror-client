import React from 'react';
import './App.css';
import './styles/styles.css';
import Microphone from './components/microphoneComponent';


function App() {
  return (
    <div className="App">
      <Microphone loadUsers={loadUsers} />
    </div>
  );
}


function loadUsers() {
  console.log('laduje ziomeczkow');
}

export default App;
