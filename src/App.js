import React, { useState } from 'react';
import './styles/styles.css';
import axios from 'axios';
import Microphone from './components/microphoneComponent';
import Camera from './components/cameraComponent';
import Time from './components/timeComponent';
import Weather from './components/weatherComponent';
import Events from './components/eventsComponent';
import News from './components/newsComponent';
import Steps from './components/stepsComponent';
import StatusBar from './components/statusBarComponent';
import { getFromStorage, setInStorage, clearStorage } from './utils/storage';
import { useEffect } from 'react';
require('dotenv').config();

function App() {
  const [login, setLogin] = useState(false);
  const [users, setUsers] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const [events, setEvents] = useState('');
  const [steps, setSteps] = useState('');
  const [weather, setWeather] = useState('');
  const [news, setNews] = useState('');
  const [newsIndex, setNewsIndex] = useState(0);

  return (
    <div className="app">
      <StatusBar />
      <Microphone
        logout={logoutFunc}
        loginOn={loginOn}
        nextNews={nextNews}
        news={getNews}
      />
      <Camera
        login={login}
        users={users}
        faceRecognized={faceRecognized}
        loginOff={loginOff}
      />
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

  function nextNews(direction) {
    setNewsIndex(prev => {
      if (prev === 19 && direction === 1) {
        return 0;
      } else if (prev === 0 && direction === -1) {
        return 19;
      } else {
        return prev + direction;
      }
    });
  }

  function logoutFunc() {
    clearStorage('mirror-current-user');
    setLoadData(false);
    setEvents([]);
  }

  function faceRecognized(id) {
    getFromStorage('mirror-users').map(user => {
      if (id.includes(user._id)) {
        setInStorage('mirror-current-user', user);
        const currentUser = getFromStorage('mirror-current-user');
        setLoadData(true);
        getFitness(currentUser);
        getEvents(currentUser);
        getWeather();
      }
      return '';
    });
  }

  function getEvents(user) {
    axios
      .post(process.env.REACT_APP_API_URL + '/api/users/getEvents', user)
      .then(res => {
        setEvents(res.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function getFitness() {
    const user = getFromStorage('mirror-current-user');
    axios
      .post(process.env.REACT_APP_API_URL + '/api/users/getFitness', user)
      .then(res => {
        console.log(res.data);
        setSteps(res.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function getWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        axios
          .get(
            `http://api.openweathermap.org/data/2.5/weather?lat=${pos.lat}&lon=${pos.lng}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
          )
          .then(res => {
            setWeather(res.data);
          })
          .catch(error => {
            console.log(error);
          });
      });
    }
  }

  function getNews() {
    axios
      .get(
        `http://newsapi.org/v2/top-headlines?country=pl&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
      )
      .then(res => {
        setNews(res.data);
      })
      .catch(error => {
        console.log(error);
      });
  }

  function Data() {
    return (
      <div className="data">
        <div className="data--left">
          <Time />
          <Events events={events} />
        </div>
        <div className="data--middle">
          <News newsIndex={newsIndex} news={news} />
        </div>
        <div className="data--right">
          <Weather weather={weather} />
          <Steps steps={steps} />
        </div>
      </div>
    );
  }
}

export default App;
