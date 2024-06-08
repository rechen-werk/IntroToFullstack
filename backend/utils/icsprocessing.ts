import ical from 'ical';
import * as ics from 'ics';

const icalToIcsAttributeMapper = (event: ical.CalendarComponent): ics.EventAttributes => {
  return {
    start: event.start.valueOf(),
    end: event.end.valueOf(),
    title: event.summary,
  };
}

function writeDelta(delta: string, calendar: string): string {
  if (!calendar || !delta) {
    return;
  }

  // parse the two calendars
  const cal = ical.parseICS(calendar);
  const deltaCal = ical.parseICS(delta);

  const events = Object.values(cal).map(icalToIcsAttributeMapper);
  const deltaEvents = Object.values(deltaCal).map(icalToIcsAttributeMapper);

  // merge the two calendars
  const mergedEvents = events.concat(deltaEvents);

  const { error, value } = ics.createEvents(mergedEvents);

  return value
}

export { writeDelta };