import express from "express";
import db from "../services/db";

const router = express.Router();

/* GET a list of all users with the given name. */
router.get('/', async function(req, res,) {

  const users = await db.user.allUsers();

  res.json(users);
});

/* GET a list of all users with the given name. */
router.get('/:mail', async function(req, res,) {

  const mail: string = req.params.mail;

  const user = await db.user.user(mail);

  res.json(user);
});

/* GET a list of all users other than the given email. */
router.get('/otherthan/:mail', async function(req, res) {
  const mail: string = req.params.mail;

  const users = await db.user.allUsersOtherThan(mail);

  res.json(users);
});

/* DELETE sets the user with the given id to inactive. */
router.delete('/:mail', async function(req, res) {
  const userId: string = req.params.mail as string;

  db.user.deleteUser(userId);

  res.send(`delete user with id: ${userId}`);
});

/* PUT updates the mail for the user with this id. */
router.put('/new/:name/:email', function(req, res) {
  const name: string = req.params.name;
  const email: string = req.params.email;

  db.user.insertUser(name, email);
  db.calendar.insertCalendar("BEGIN:VCALENDAR\nEND:VCALENDAR", email);

  res.status(200).send("User created successfully!");
});

/* POST updates the mail for the user with this old mail. */
router.post('/mail/:oldMail/:newMail', async function(req, res) {
  const oldMail: string = req.params.oldMail as string;
  const newMail: string = req.params.newMail as string;

  db.user.updateUserEmail(oldMail, newMail);

  res.send({ oldMail, newMail })
});

export default router;
