import ical from 'ical';

function writeDelta(delta: string, ics: string): string {
  let icsString = ics

  const cal = ical.parseICS(ics);

  return icsString
}

export { writeDelta };