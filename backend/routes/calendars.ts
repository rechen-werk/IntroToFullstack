import express from "express";

const router = express.Router();

/* GET the ics-file for the calendar with given id. */
router.get('/ics/:calendarId', function(req, res) {
  const calendarId = req.params.calendarId
  res.send({ calendarId });
});

/* GET a list of all calendars for the user with given id. */
router.get('/:userId', function(req, res) {
  const userId = req.params.userId
  res.send({ userId });
});

/* POST creates a new calendar for user with userId. */
router.post('/', function(req, res) {
  const userId = req.query.userId
  const calendarName = req.query.name
  res.send({ userId, calendarName });
});

/* DELETE sets the calendar with calendarId to inactive. */
router.delete('/:calendarId', function(req, res) {
  const calendarId = req.params.calendarId
  res.send({ calendarId });
});

export default router;
