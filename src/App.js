import React, { useState } from 'react';
import './App.css';
import './styles/styles.css';
import Microphone from './components/microphoneComponent';
import Camera from './components/cameraComponent';
import { getFromStorage, setInStorage } from './utils/storage';


function App() {

  const [login, setLogin] = useState(false);
  const [logout, setLogout] = useState(false);
  const [users, setUsers] = useState(false);
  const [loadData, setLoadData] = useState(false);

  return (
    <div className="App">
      <Microphone logout={logoutFunc} loginOn={loginOn} />
      <Camera login={login} users={users} faceRecognized={faceRecognized} loginOff={loginOff}/>
      {loadData ? userData() : ''}
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

  function loginOff(){
    setLogin(false);
  }

  function logoutFunc() {
    setLogout(true);
  }

  function faceRecognized(id){
    setLoadData(true);
  }

}



function userData(){
  return(
    <div>koks</div>
  )
}
export default App;
