import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

function Weather() {
  const [weather, setWeather] = useState('');

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <div className="weather">
      <div>
        <img src={'../public/resources/weather-icons/01d.svg'} alt="" />
      </div>
      {weather ? <WeatherElement weather={weather} /> : ''}
    </div>
  );
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
}

function WeatherElement(props) {
  const icon = require('../resources/weather-icons/' +
    props.weather.weather[0].icon +
    '.svg');

  const cloud = require('../resources/weather-icons/clouds.svg');
  const temperature = require('../resources/weather-icons/temperature.svg');

  return (
    <div className="weather__container">
      <div className="weather--main">
        <img src={icon} />
        {props.weather.weather[0].main}
      </div>
      <div className="weather--info">
          <img src={temperature} />
          {Math.round(props.weather.main.temp - 273) + '°C'}
          <img src={cloud} />
          {props.weather.clouds.all + '%'}
      </div>
      <div className="weather--place">{props.weather.name}</div>
    </div>
  );
}

//ikonki dosciagac

// 'https://openweathermap.org/current'

export default Weather;
