import React, { useState, useEffect } from 'react';
import { getFromStorage, setInStorage } from '../utils/storage';
import axios from 'axios';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'pl-PL';

function Microphone(props) {

    const localStorage = getFromStorage('mirror-users');
    let newUser = true, newUserKey, newUserKeyOK, newUserPassword, newUserPasswordOK;

    useEffect(() => {
        console.log(localStorage);
        if (localStorage) {
            newUser = false;
        }
        recognition.start();
    }, []);

    recognition.onend = () => {
        recognition.start();
    }

    recognition.onresult = function (e) {

        const key = document.querySelector('.key');
        const password = document.querySelector('.password');
        const output = document.querySelector('.output');
        // const monitor = document.querySelector('.monitor');

        const current = e.resultIndex;
        let speech = e.results[current][0].transcript;


        // monitor.innerHTML = `Twoje słowa:   ${speech}`;

        if (!newUserKey) {
            let keyStr = speech.toUpperCase();
            keyStr = keyStr.trim();
            keyStr = keyStr.replace(/\s/g, "");
            keyStr = keyStr.replace(',', "");
            keyStr = keyStr.replace('.', "");
            newUserKey = keyStr;
            key.innerHTML = `${newUserKey}`;
            output.innerHTML = `Czy kod się zgadza?`;
        }

        if (!newUserKeyOK && newUserKey && speech.includes('tak')) {
            newUserKeyOK = true;
            output.innerHTML = `Teraz jeszcze 4-cyfrowy klucz`;
            speech = '';
        }
        if (!newUserKeyOK && newUserKey && speech.includes('nie')) {
            key.innerHTML = '';
            newUserKey = '';
            output.innerHTML = `Spróbujmy jeszcze raz.\n Podaj mi swój swój 6-cyfrowy identyfikator`;
        }

        if (newUserKeyOK && !newUserPassword) {
            let passwordStr = speech.toUpperCase();
            passwordStr = passwordStr.trim();
            passwordStr = passwordStr.replace(/\s/g, "");
            passwordStr = passwordStr.replace(',', "");
            passwordStr = passwordStr.replace('.', "");
            newUserPassword = passwordStr;
            password.innerHTML = `${newUserPassword}`;
        }

        if (newUserKeyOK && newUserPassword && !newUserPasswordOK) {
            output.innerHTML = `Czy klucz się zgadza?`;
        }

        if (newUserKeyOK && newUserPassword && speech.includes('tak')) {
            newUserPasswordOK = true;
            output.innerHTML = `Super, pozwól że zweryfikuję`;
            verifyUser({
                number: newUserKey,
                connection_key: newUserPassword
            });
        }
        if (newUserKeyOK && newUserPassword && speech.includes('nie')) {
            password.innerHTML = '';
            newUserPassword = '';
            output.innerHTML = `Spróbujmy jeszcze raz. \n Podaj mi swój swój 4-cyfrowy klucz`;
        }

        if (speech.includes('reset')) {
            newUser = true;
            newUserKey = '';
            newUserKeyOK = false;
            newUserPassword = '';
            newUserPasswordOK = false;
            key.innerHTML = '';
            password.innerHTML = '';
            output.innerHTML = `Spróbujmy jeszcze raz. \n Podaj mi swój swój 6-cyfrowy kod`;
        }

        if (speech.includes('nowy')) {
            newUser = true;
        }

    }

    function verifyUser(data) {

        const output = document.querySelector('.output');

        axios.post('http://localhost:5000/api/users/verify', data)
            .then(res => {
                if (res.data.success) {
                    output.innerHTML = `Wszystko się zgadza, witaj ${res.data.user.username}`;
                    if (localStorage) {
                        setInStorage("mirror-users", [...localStorage, res.data.user]);
                    }
                    else
                        setInStorage("mirror-users", [res.data.user]);
                }
            })
            .catch(error => {
                output.innerHTML = `Coś się nie zgadza`;
            });
    }

    return (
        <div className="microphone__container">
            <div className='output__container'>
                <div className="output">
                    {newUser ? `Cześć, jesteś tu nowy? \n Przeliteruj mi swój 6-cyfrowy identyfikator` : ''}
                </div>
            </div>
            <div className='key__container'>
                <div className="key--header">Twój identyfikator: </div>
                <div className="key"></div>
            </div>
            <div className='password__container'>
                <div className="password--header">Twój klucz: </div>
                <div className="password"></div>
            </div>
        </div>
    );
}

export default Microphone;
