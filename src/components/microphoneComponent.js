import React, { useState, useEffect } from 'react';
import { getFromStorage, setInStorage, clearStorage } from '../utils/storage';
import axios from 'axios';
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'pl-PL';

function Microphone(props) {
  const localStorage = getFromStorage('mirror-users');
  const [existUsers, setExistUsers] = useState(false);
  const [newUser, setNewUser] = useState(false);
  const [newUserKey, setNewUserKey] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  let newLocalUser = newUser;
  let newLocalUserKey = '';
  let newLocalUserKeyOK = false;
  let newLocalUserPassword = '';
  let newLocalUserPasswordOK = false;

  useEffect(() => {
    if (localStorage) {
      setExistUsers(true);
    }
  }, [localStorage]);

  useEffect(() => {
    listening();
  }, []);

  function listening() {
    // document.querySelector('.statusBar__icon--microphone').style.opacity = 1;

    recognition.start();

    recognition.onend = () => {
      recognition.start();
    };

    recognition.onresult = function(e) {
      const key = document.querySelector('.key--value');
      const password = document.querySelector('.password--value');
      const output = document.querySelector('.output--value');
      const monitor = document.querySelector('.monitor--value');

      const current = e.resultIndex;
      let speech = e.results[current][0].transcript.toUpperCase();

      monitor.innerHTML = `Twoje słowa:   ${speech}`;

      if (!newLocalUserKey && newLocalUser) {
        let keyStr = speech;
        keyStr = keyStr.trim();
        keyStr = keyStr.replace(/\s/g, '');
        keyStr = keyStr.replace(',', '');
        keyStr = keyStr.replace('.', '');
        newLocalUserKey = keyStr;
        setNewUserKey(keyStr);
        key.innerHTML = `${newLocalUserKey}`;
        output.innerHTML = `Czy kod się zgadza?`;
      }

      if (!newLocalUserKeyOK && newLocalUserKey && speech.includes('TAK')) {
        newLocalUserKeyOK = true;
        output.innerHTML = `Teraz jeszcze 4-cyfrowy klucz`;
        speech = '';
      }
      if (!newLocalUserKeyOK && newLocalUserKey && speech.includes('NIE')) {
        key.innerHTML = '';
        newLocalUserKey = '';
        setNewUserKey('');
        output.innerHTML = `Spróbujmy jeszcze raz.\n Podaj mi swój swój 6-cyfrowy identyfikator`;
      }

      if (newLocalUserKeyOK && !newLocalUserPassword) {
        let passwordStr = speech;
        passwordStr = passwordStr.trim();
        passwordStr = passwordStr.replace(/\s/g, '');
        passwordStr = passwordStr.replace(',', '');
        passwordStr = passwordStr.replace('.', '');
        newLocalUserPassword = passwordStr;
        setNewUserPassword(passwordStr);
        password.innerHTML = `${newLocalUserPassword}`;
      }

      if (
        newLocalUserKeyOK &&
        newLocalUserPassword &&
        !newLocalUserPasswordOK
      ) {
        output.innerHTML = `Czy klucz się zgadza?`;
      }

      if (newLocalUserKeyOK && newLocalUserPassword && speech.includes('TAK')) {
        newLocalUserPasswordOK = true;
        output.innerHTML = `Super, pozwól że zweryfikuję`;
        verifyUser({
          number: newLocalUserKey,
          connection_key: newLocalUserPassword
        });
      }
      if (newLocalUserKeyOK && newLocalUserPassword && speech.includes('NIE')) {
        password.innerHTML = '';
        newLocalUserPassword = '';
        setNewUserPassword('');
        output.innerHTML = `Spróbujmy jeszcze raz. \n Podaj mi swój swój 4-cyfrowy klucz`;
      }

      if (speech.includes('RESET')) {
        clear();
        output.innerHTML = ``;
      }

      if (speech.includes('NOWY') || speech.includes('DODAJ')) {
        newLocalUser = true;
        setNewUser(true);
      }

      if (
        speech.includes('CZEŚĆ') ||
        speech.includes('WITAJ') ||
        speech.includes('ZALOGUJ') ||
        speech.includes('SIEMA')
      ) {
        clear();
        props.loginOn();
      }

      if (
        speech.includes('NA RAZIE') ||
        speech.includes('KONIEC') ||
        speech.includes('WYLOGUJ')
      ) {
        props.logout();
      }

      if (
        speech.includes('USTAWIENIA DOMYŚLNE') ||
        speech.includes('RESET FABRYCZNY')
      ) {
        props.logout();
        clearStorage('mirror-users');
        clearStorage('mirror-current-user');
      }

      if (
        speech.includes('NASTĘPNE') ||
        speech.includes('KOLEJNE') ||
        speech.includes('NASTĘPNY') ||
        speech.includes('KOLEJNY')
      ) {
        props.nextNews(1);
      }

      if (speech.includes('POPRZEDNI') || speech.includes('POPRZEDNIE')) {
        props.nextNews(-1);
      }

      if (speech.includes('WIADOMOŚCI')) {
        props.news();
      }
    };
  }

  function clear() {
    const key = document.querySelector('.key--value');
    const password = document.querySelector('.password--value');

    setNewUser(false);
    setNewUserKey('');
    setNewUserPassword('');
    newLocalUser = false;
    newLocalUserKey = '';
    newLocalUserKeyOK = false;
    newLocalUserPassword = '';
    newLocalUserPasswordOK = false;

    key.innerHTML = '';
    password.innerHTML = '';
  }

  function verifyUser(data) {
    const output = document.querySelector('.output--value');

    axios
      .post(process.env.REACT_APP_API_URL + '/api/users/verify', data)
      .then(res => {
        if (res.data.success) {
          output.innerHTML = `Wszystko się zgadza, witaj ${res.data.user.username}`;

          if (localStorage) {
            setInStorage('mirror-users', [...localStorage, res.data.user]);
          } else setInStorage('mirror-users', [res.data.user]);
        }
      })
      .catch(error => {
        output.innerHTML = `Coś się nie zgadza \n Aby spróbować jeszcze raz powiedz reset`;
      });
  }

  return (
    <div hidden={existUsers} className="microphone">
      <div className="output__container">
        <div className="output--value">
          {newUser
            ? `Cześć, jesteś tu nowy? \n Przeliteruj mi swój 6-cyfrowy identyfikator`
            : ''}
        </div>
      </div>
      <div className="auth_container">
        <div
          className="key__container"
          style={{ display: newUserKey ? 'flex' : 'none' }}
        >
          <div className="key--header">Twój identyfikator: </div>
          <div className="key--value"></div>
        </div>
        <div
          className="password__container"
          style={{ display: newUserPassword ? 'flex' : 'none' }}
        >
          <div className="password--header">Twój klucz: </div>
          <div className="password--value"></div>
        </div>
      </div>
      <div className="monitor--value"></div>
    </div>
  );
}

export default Microphone;
