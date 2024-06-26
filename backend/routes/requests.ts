import express from "express";
import db from "../services/db";
import { CalendarRequest, RequestStatus } from "../utils/types";
import { createHash } from "crypto";
import { clientEmails } from "../app";
import WebSocket from "ws";

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
router.post('/', function(req, res) {
  const id = createHash('sha256').update(Date.now().toString()).digest('hex');
  const fromEmail = req.query.fromEmail.toString();
  const toEmail = req.query.toEmail.toString();
  const from = req.query.from.toString();
  const to = req.query.to.toString();
  const title = req.query.title.toString();
  const status = RequestStatus.OPEN;

  const start = new Date(from);
  const end = new Date(to);
  if (start >= end || start.getDay() != end.getDay()) {
    res.status(400).send("Invalid time range");
    return;
  }

  db.request.insertRequest(new CalendarRequest(id, fromEmail, toEmail, from, to, title, status));

  res.json({ id });
});

/* DELETE sets the request with the given id to inactive. */
router.delete('/:requestId', async function(req, res) {
  const requestId = req.params.requestId
  const request = await db.request.findRequestById(requestId);

  db.request.deleteRequest(requestId);

  const client = clientEmails.get(request.toEmail)
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(`A request from ${request.fromEmail} has been canceled!`);
  }

  res.json(`Canceled request with id: ${requestId}`);
});

/* PUT updates the request to be accepted. */
router.post('/accept/:requestId', async function(req, res) {
  const requestId = req.params.requestId;
  const request = await db.request.findRequestById(requestId);

  db.request.acceptRequest(requestId);

  const client = clientEmails.get(request.fromEmail)
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(`Your request to ${request.toEmail} has been accepted!`);
  }

  res.json({ requestId })
});

/* PUT updates the request to be denied. */
router.post('/deny/:requestId', async function(req, res) {
  const requestId = req.params.requestId;
  const request = await db.request.findRequestById(requestId);

  db.request.denyRequest(requestId);

  const client = clientEmails.get(request.fromEmail)
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(`Your request to ${request.toEmail} has been denied!`);
  }

  res.json({ requestId })
});
export default router;
