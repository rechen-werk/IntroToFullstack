import express from "express";
import db from "../services/db";
import { Calendar } from "../utils/types";
import { writeDelta } from "../utils/icsprocessing";

const router = express.Router();

/* GET the ics-file for the calendar with given email. */
router.get('/ics/:email', async function(req, res) {
  const email = req.params.email

  const c: Calendar = await db.calendar.findCalendarByEmail(email);

  const result = c.icsContent;

  res.json(result);
});

/* POST an updated version of icsContent into the database */
router.post('/update', async function(req, res) {
  const changes = req.query.changes.toString();
  const email = req.query.email as string;

  if (!changes || !email) {
    res.status(400).send("Missing parameters");
    return;
  }

  const icsContent = (await db.calendar.findCalendarByEmail(email)).icsContent;

  const newIcsContent = writeDelta(changes, icsContent);

  if (!newIcsContent) {
    res.status(400).send("Could not apply changes to calendar");
    return;
  }
  
  db.calendar.updateCalendarContent(newIcsContent, email);
  res.json({ newIcsContent });
});

/* POST creates a new calendar for user with userId. */
router.post('/', function(req, res) {
  const icsContent = req.body;
  const email = req.query.email.toString();

  db.calendar.insertCalendar(icsContent, email);

  res.status(200).send();
});

/* DELETE sets the calendar with calendarId to inactive. */
router.delete('/:calendarId', function(req, res) {
  const calendarId = req.params.calendarId.toString();

  db.calendar.deleteCalendar(calendarId);

  res.json({ calendarId });
});

export default router;
