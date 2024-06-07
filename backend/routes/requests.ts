import express from "express";
import db from "../services/db";
import { CalendarRequest, RequestStatus } from "../utils/types";
import { createHash } from "crypto";

const router = express.Router();

/* GET a list of all requests by the user with id. */
router.get('/by/:email', async function(req, res,) {
  const email: string = req.params.email

  const requests: [CalendarRequest] = await db.request.findRequestsByFromUserId(email); 

  res.send({ requests });
});

/* GET a list of all requests for the user with id. */
router.get('/for/:email', async function(req, res) {
  const email: string = req.params.email

  const requests: [CalendarRequest] = await db.request.findRequestsByToUserId(email); 

  res.send({ requests });
});

/* POST creates a new request to toUserId from fromUserId. */
router.post('/', async function(req, res) {
  const id = createHash('sha256').update(Date.now().toString()).digest('hex');
  const fromEmail = req.query.fromEmail.toString();
  const toEmail = req.query.toEmail.toString();
  const from = req.query.from.toString();
  const to = req.query.to.toString();
  const title = req.query.title.toString();
  const description = req.query.description.toString();
  const status = RequestStatus.OPEN;

  db.request.insertRequest(new CalendarRequest(id, fromEmail, toEmail, from, to, title, description, status));

  res.json({ id });
});

/* DELETE sets the request with the given id to inactive. */
router.delete('/:requestId', async function(req, res) {
  const requestId = req.params.requestId

  await db.request.deleteRequest(requestId);

  res.send(`delete user with id: ${requestId}`);
});

/* PUT updates the request to be accepted. */
router.post('/accept/:requestId', async function(req, res) {
  const requestId = req.params.requestId;

  db.request.acceptRequest(requestId);

  res.send({ requestId })
});

/* PUT updates the request to be denied. */
router.post('/deny/:requestId', async function(req, res) {
  const requestId = req.params.requestId;

  db.request.denyRequest(requestId);

  res.send({ requestId })
});
export default router;
