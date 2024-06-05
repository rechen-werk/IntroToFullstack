import express from "express";
import db from "../services/db";

const router = express.Router();

/* GET a list of all users with the given name. */
router.get('/', async function(req, res,) {

  const users = await db.user.allUsers();

  res.json(users);
});

/* GET a list of all users other than the given email. */
router.get('/otherthan/:mail', async function(req, res) {
  const mail: string = req.params.mail;

  const users = await db.user.allUsersOtherThan(mail);

  res.json(users);
});

/* GET the user with the specified id. */
// router.get('/by-id/:userId', function(req, res) {
//   const userId: string = req.params.userId

//   res.send(`search by id: ${userId}`);
// });

/* DELETE sets the user with the given id to inactive. */
router.delete('/:mail', async function(req, res) {
  const userId: string = req.params.mail as string;

  await db.user.deleteUser(userId);

  res.send(`delete user with id: ${userId}`);
});

/* PUT updates the mail for the user with this id. */
router.put('/new/:name/:email', async function(req, res) {
  const name: string = req.params.name;
  const mail: string = req.params.email;

  await db.user.insertUser(name, mail);

  res.json({ name, mail })
});

// TODO: constraints!
/* POST updates the mail for the user with this old mail. */
router.post('/mail/:oldMail/:newMail', async function(req, res) {
  const oldMail: string = req.params.oldMail as string;
  const newMail: string = req.params.newMail as string;

  await db.user.updateUserEmail(oldMail, newMail);

  res.send({ oldMail, newMail })
});

/* PUT updates the username for the user with this id. */
// router.put('/name/:userId/:name', async function(req, res) {
//   const userId: string = req.params.userId
//   const name: string = req.params.name

//   // TODO: get email address!
//   const email: string = "example@gmail.com"

//   await db.user.insertUser(email);
//   res.send({ email })
// });

export default router;
