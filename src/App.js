import React, { useState } from 'react';
import './App.css';
import './styles/styles.css';
import axios from 'axios';
import Microphone from './components/microphoneComponent';
import Camera from './components/cameraComponent';
import Clock from './components/timeComponent';
import { getFromStorage, setInStorage, clearStorage } from './utils/storage';
import { useEffect } from 'react';
require('dotenv').config()


function App() {

  const abc = getFromStorage('mirror-current-user');
  const [login, setLogin] = useState(false);
  const [logout, setLogout] = useState(false);
  const [users, setUsers] = useState(false);
  const [loadData, setLoadData] = useState(false);

  return (
    <div className="App">
      <Microphone logout={logoutFunc} loginOn={loginOn} />
      <Camera login={login} users={users} faceRecognized={faceRecognized} loginOff={loginOff} />
      {loadData ? userData() : ''}
      <button onClick={getEvents}>send</button>
    </div>
  );

  function loginOn() {
    if (getFromStorage('mirror-users')) {
      setUsers(getFromStorage('mirror-users'));
      setLogin(true);
    } else {
      const output = document.querySelector('.output');
      output.innerHTML = 'Nie dodano żadnych użytkowników';
    }
  }

  function loginOff() {
    setLogin(false);
  }

  function logoutFunc() {
    clearStorage('mirror-current-user');
    setLogout(true);
  }

  function faceRecognized(id) {

    console.log('rozpoznalem');

    const current = getFromStorage('mirror-users').reduce((user) => user._id === id);

    setInStorage('mirror-current-user', current);
    getEvents(current);
    setLoadData(true);
  }

  function getEvents() {

    let user = abc;

    axios.post(process.env.REACT_APP_API_URL + '/api/users/getEvents', user)
      .then(res => {
        console.log(res.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

}


function userData() {
  return (
    <div>
      <Clock />
    koks
    </div>
  )
}
export default App;
