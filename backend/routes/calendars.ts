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

  res.json({ result });
});

/* GET a list of all calendars for the user with given id. */
// router.get('/:email', async function(req, res) {
//   const email = req.params.email

//   const calendar: Calendar = await db.calendar.findCalendarByEmail(email);
//   const result = calendar.icsContent;

//   res.send({ result });
// });

router.post('/update', async function(req, res) {
  const changes = req.query.changes as string;
  const email = req.query.email.toString();
  const icsContent = (await db.calendar.findCalendarByEmail(email)).icsContent;

  const newIcsContent = writeDelta(changes, icsContent);
  
  db.calendar.updateCalendarContent(newIcsContent, email);
  res.json({ newIcsContent });
});

/* POST creates a new calendar for user with userId. */
router.post('/', async function(req, res) {
  const id = "TODO";
  const icsContent = req.query.icsContent.toString();
  const email = req.query.email.toString();

  db.calendar.insertCalendar(new Calendar(id, icsContent, email, true));

  res.json({ id, email });
});

/* DELETE sets the calendar with calendarId to inactive. */
router.delete('/:calendarId', function(req, res) {
  const calendarId = req.params.calendarId.toString();

  db.calendar.deleteCalendar(calendarId);

  res.json({ calendarId });
});

export default router;
