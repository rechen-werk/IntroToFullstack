import ical from 'ical';

function writeDelta(delta: string, ics: string): string {
  if (!ics || !delta) {
    return;
  }
  const cal = ical.parseICS(ics);
  const deltaCal = ical.parseICS(delta);

  console.log("deltaCal", deltaCal);

  return ics
}

export { writeDelta };