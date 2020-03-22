import React from 'react';

function Events(props) {

    return (
        <div className="events">
            <Today />
            <Tommorow />
            <Weekly />
        </div>
    );

    function Today() {
        if (getEventsInPeriod(props.events, 0, 0, false)[0])
            return (
                <div className="events__container">
                    <div className="events--header">Today:</div>
                    {getEventsInPeriod(props.events, 0, 0, false).map((event) => {
                        return <li key={event.id}>{event.event}</li>
                    })}
                </div>
            );
        return ('');
    }
    function Tommorow() {
        if (getEventsInPeriod(props.events, 1, 0, false)[0])
            return (
                <div className="events__container">
                    <div className="events--header">Tommorow:</div>
                    {getEventsInPeriod(props.events, 1, 0, false).map((event) => {
                        return <li key={event.id}>{event.event}</li>
                    })}
                </div>
            );
        return ('');
    }
    function Weekly() {
        if (getEventsInPeriod(props.events, 2, 4, true)[0])
            return (
                <div className="events__container">
                    <div className="events--header">Weekly:</div>
                    {getEventsInPeriod(props.events, 2, 4, true).map((event) => {
                        return <li key={event.id}>{event.event}</li>
                    })}
                </div>
            );
        return ('');
    }

}



function getEventsInPeriod(events, skip, period, dayname) {

    const DayName = new Array(7)
    DayName[0] = "Niedziela"
    DayName[1] = "Poniedziałek"
    DayName[2] = "Wtorek"
    DayName[3] = "Środa"
    DayName[4] = "Czwartek"
    DayName[5] = "Piątek"
    DayName[6] = "Sobota"

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + skip);
    if (skip !== 0) {
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
    }
    const finishDate = new Date();
    finishDate.setDate(startDate.getDate() + period);
    finishDate.setHours(0);
    finishDate.setMinutes(0);
    finishDate.setSeconds(0);
    finishDate.setMilliseconds(0);
    finishDate.setDate(finishDate.getDate() + 1);
    finishDate.setTime(finishDate.getTime() - 1);

    let result = [];
    events.map((event) => {
        const date = event.start.dateTime || event.start.date;
        const eventDate = new Date(date);
        if (eventDate.getTime() > startDate.getTime() && eventDate.getTime() < finishDate.getTime()) {
            if (dayname) {
                const day = (DayName[eventDate.getDay()]);
                result.push({event: `${day} - ${formatDigits(eventDate.getUTCHours() + 1)}:${formatDigits(eventDate.getUTCMinutes())} - ${event.summary}`, id: event.id});
            } else {
                result.push({event: `${formatDigits(eventDate.getUTCHours() + 1)}:${formatDigits(eventDate.getUTCMinutes())} - ${event.summary}`, id: event.id});
            }
        }
        return ''
    })
    return result;
}

function formatDigits(digits) {
    if (digits < 10) {
        return '0' + digits;
    }
    return digits;
}

export default Events;

