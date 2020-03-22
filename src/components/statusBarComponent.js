import React from 'react';

function StatusBar() {

    return (
        <div className="statusBar">
            <div className="statusBar__icon statusBar__icon--microphone"></div>
            <div className="statusBar__icon statusBar__icon--camera"></div>
            <div className="statusBar__icon statusBar__icon--counter"></div>
        </div>
    );
}

export default StatusBar;

