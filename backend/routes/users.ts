import express from "express";
import db from "../services/db";

const router = express.Router();

/* GET a list of all users with the given name. */
router.get('/by-name/:name', function(req, res,) {
  const userName: string = req.params.name

  res.send(`search by name: ${userName}`);
});

/* GET the user with the specified id. */
router.get('/by-id/:userId', function(req, res) {
  const userId: string = req.params.userId

  res.send(`search by id: ${userId}`);
});

/* DELETE sets the user with the given id to inactive. */
router.delete('/:userId', function(req, res) {
  const userId: string = req.params.userId

  res.send(`delete user with id: ${userId}`);
});

/* PUT updates the mail for the user with this id. */
router.put('/mail/:userId/:mail', function(req, res) {
  const userId: string = req.params.userId
  const mail: string = req.params.mail

  res.send({ userId, mail })
});

/* PUT updates the username for the user with this id. */
router.put('/name/:userId/:name', async function(req, res) {
  const userId: string = req.params.userId
  const name: string = req.params.name

  // TODO: get email address!
  const email: string = "example@gmail.com"

  await db.user.createUser(userId, name, email);
  res.send({ userId, name })
});

export default router;
