import React, { useState } from 'react';

function Weather(props) {

  return (
    <div className="weather">
      {props.weather ? <WeatherElement weather={props.weather} /> : ''}
    </div>
  );
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

export default Weather;
