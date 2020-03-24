import React, { useState } from 'react';

function Steps(props) {
  return (
    <div className="steps">
      {props.steps ? <StepsElement steps={props.steps} /> : ''}
    </div>
  );
}

function StepsElement(props) {
  const foot = require('../resources/footprints.svg');
  let stepsYesterday = 0;
  let stepsToday = 0;

  if (props.steps[0].dataset[0].point[0])
    stepsYesterday = props.steps[0].dataset[0].point[0].value[0].intVal;
  if (props.steps[1].dataset[0].point[0])
    stepsToday = props.steps[1].dataset[0].point[0].value[0].intVal;

  return (
    <div className="steps">
      <div className="steps--icon">
        <img src={foot} />
      </div>
      <div className="steps--info">
        <div>Dziś: {stepsToday}</div>
        <div>Wczoraj: {stepsYesterday}</div>
      </div>
    </div>
  );
}

export default Steps;
