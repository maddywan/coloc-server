import '../styles.css';
import './calendar.css';
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const AgendaPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/agenda')
      .then(res => res.json())
      .then(data => {
        setEvents(
          data.map(event => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end,
            allDay: event.allDay
          }))
        );
      });
  }, []);

  return (
    <div>
      <div className="title-bar">
        <h2 className='title-bar-item'>Planning</h2>
      </div>
      <div className='calendar-container'>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin
          ]}
          initialView="timeGridWeek"
          locale="fr"
          firstDay={1}
          height="calc(100vh - 360px)"
          expandRows={true}
          slotMinTime="08:00:00"
          slotMaxTime="23:59:59"
          nowIndicator={true}
          allDaySlot={false}
          slotDuration="01:00:00"
          slotLabelInterval="01:00"

          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}

          buttonText={{
            today: "Aujourd'hui",
            month: 'Mois',
            week: 'Semaine',
            day: 'Jour'
          }}

          events={events}
        />
      </div>
    </div>
  );
};

export default AgendaPage;