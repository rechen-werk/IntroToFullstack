import express from "express";

const router = express.Router();

/* GET a list of all requests by the user with id. */
router.get('/by/:userId', function(req, res,) {
  const userId: string = req.params.userId

  res.send({ userId });
});

/* GET a list of all requests for the user with id. */
router.get('/for/:userId', function(req, res) {
  const userId: string = req.params.userId

  res.send({ userId });
});

/* POST creates a new request to toUserId from fromUserId. */
router.post('/', function(req, res) {
  const fromUserId = req.query.fromUserId
  const toUserId = req.query.toUserId
  res.send({ fromUserId, toUserId });
});

/* DELETE sets the request with the given id to inactive. */
router.delete('/:requestId', function(req, res) {
  const requestId = req.params.requestId
  res.send(`delete user with id: ${requestId}`);
});

/* PUT updates the request to be accepted. */
router.put('/accept/:requestId', function(req, res) {
  const requestId = req.query.requestId

  res.send({ requestId })
});

/* PUT updates the request to be denied. */
router.put('/deny/:requestId', function(req, res) {
  const requestId = req.query.requestId

  res.send({ requestId })
});
export default router;
