import React from 'react';

class Time extends React.Component {
    constructor() {
        super()
        this.state = {
            date: this.getDateStr(),
            time: this.getTimeStr()
        };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: this.getDateStr(),
            time: this.getTimeStr()
        });
    }

    getDateStr() {

        let DayName = new Array(7)
        DayName[0] = "niedziela"
        DayName[1] = "poniedziałek"
        DayName[2] = "wtorek"
        DayName[3] = "środa"
        DayName[4] = "czwartek"
        DayName[5] = "piątek"
        DayName[6] = "sobota"

        let MonthName = new Array(12)
        MonthName[0] = "stycznia"
        MonthName[1] = "lutego"
        MonthName[2] = "marca"
        MonthName[3] = "kwietnia"
        MonthName[4] = "maja"
        MonthName[5] = "czerwca"
        MonthName[6] = "lipca"
        MonthName[7] = "sierpnia"
        MonthName[8] = "września"
        MonthName[9] = "października"
        MonthName[10] = "listopada"
        MonthName[11] = "grudnia"

        var Today = new Date()
        var WeekDay = Today.getDay()
        var Month = Today.getMonth()
        var Day = Today.getDate()
        return Day + ' ' + MonthName[Month] + ' ' + DayName[WeekDay]
    }

    getTimeStr() {
        var Today = new Date()
        var Hour = Today.getHours()
        var Minute = Today.getMinutes()
        var HourStr = '';
        var MinuteStr = '';
        if (Hour < 10) {
            HourStr = '0' + Hour;
        } else {
            HourStr = Hour;
        }

        if (Minute < 10) {
            MinuteStr = '0' + Minute;
        } else {
            MinuteStr = Minute;
        }
        return HourStr + ':' + MinuteStr
    }

    render() {
        return (
            <div className="time">
                <div className="time--value">
                    {this.state.time}
                </div>
                <div className="date--value">
                    {this.state.date}
                </div>
            </div>
        );
    }
}


export default Time;