import React, { useState } from 'react';
import './styles/styles.css';
import axios from 'axios';
import Microphone from './components/microphoneComponent';
import Camera from './components/cameraComponent';
import Time from './components/timeComponent';
import Weather from './components/weatherComponent';
import Events from './components/eventsComponent';
import StatusBar from './components/statusBarComponent';
import { getFromStorage, setInStorage, clearStorage } from './utils/storage';
require('dotenv').config()


function App() {

  const [login, setLogin] = useState(false);
  const [users, setUsers] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [events, setEvents] = useState([]);

  return (
    <div className="app">
      <StatusBar />
      <Microphone logout={logoutFunc} loginOn={loginOn} />
      <Camera login={login} users={users} faceRecognized={faceRecognized} loginOff={loginOff} />
      {loadData ? <Data /> : ''}
    </div>
  );

  function loginOn() {
    if (getFromStorage('mirror-users')) {
      setUsers(getFromStorage('mirror-users'));
      setLogin(true);
    } else {
      const output = document.querySelector('.output--value');
      output.innerHTML = 'Nie dodano żadnych użytkowników';
    }
  }

  function loginOff() {
    setLogin(false);
  }

  function logoutFunc() {
    clearStorage('mirror-current-user');
    setLoadData(false);
    setEvents([]);
  }

  function faceRecognized(id) {

    getFromStorage('mirror-users').map((user) => {
      if (id.includes(user._id)) {
        setInStorage('mirror-current-user', user);
        const currentUser = getFromStorage('mirror-current-user');
        getEvents(currentUser);
      }
      return ''
    });

  }

  function getEvents(user) {

    axios.post(process.env.REACT_APP_API_URL + '/api/users/getEvents', user)
      .then(res => {
        setEvents(res.data);
        setLoadData(true);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function Data() {
    return (
      <div className="data">
        <Time />
        <Events events={events} />
        <Weather />
      </div>
    )
  }
}

export default App;
