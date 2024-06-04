import express from "express";
import db from "../services/db";

const router = express.Router();

/* GET a list of all users with the given name. */
// router.get('/by-name/:name', function(req, res,) {
//   const userName: string = req.params.name

//   res.send(`search by name: ${userName}`);
// });

/* GET the user with the specified id. */
// router.get('/by-id/:userId', function(req, res) {
//   const userId: string = req.params.userId

//   res.send(`search by id: ${userId}`);
// });

/* DELETE sets the user with the given id to inactive. */
router.delete('/:mail', async function(req, res) {
  const userId: string = req.params.mail.toString();

  await db.user.deleteUser(userId);

  res.send(`delete user with id: ${userId}`);
});

/* PUT updates the mail for the user with this id. */
router.put('/:mail', async function(req, res) {
  const mail: string = req.params.mail.toString();

  await db.user.insertUser(mail);

  res.send({ mail })
});

// TODO: constraints!
/* POST updates the mail for the user with this old mail. */
router.post('/mail/:oldMail/:newMail', async function(req, res) {
  const oldMail: string = req.params.oldMail.toString();
  const newMail: string = req.params.newMail.toString();

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
