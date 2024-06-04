import express from "express";
import db from "../services/db";
import { Calendar } from "../utils/types";

const router = express.Router();

/* GET the ics-file for the calendar with given id. */
router.get('/ics/:calendarId', async function(req, res) {
  const calendarId = req.params.calendarId

  const c: Calendar = await db.calendar.findCalendarById(calendarId);
  const result = c.icsContent;

  res.send({ result });
});

/* GET a list of all calendars for the user with given id. */
router.get('/:email', async function(req, res) {
  const email = req.params.email

  const calendars: [Calendar] = await db.calendar.findCalendarsByEmail(email);
  const result = calendars.map((c: Calendar) => c.icsContent);

  res.send({ result });
});

/* POST creates a new calendar for user with userId. */
router.post('/', async function(req, res) {
  const id = "TODO";
  const icsContent = req.query.icsContent.toString();
  const email = req.query.email.toString();

  db.calendar.insertCalendar(new Calendar(id, icsContent, email, true));

  res.send({ id, email });
});

/* DELETE sets the calendar with calendarId to inactive. */
router.delete('/:calendarId', function(req, res) {
  const calendarId = req.params.calendarId.toString();

  db.calendar.deleteCalendar(calendarId);

  res.send({ calendarId });
});

export default router;
