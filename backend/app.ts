import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import WebSocket from "ws";

import userRouter from "./routes/users";
import calendarRouter from "./routes/calendars";
import requestsRouter from "./routes/requests";

const app = express();
const corsOptions = {
  origin: "http://localhost:8000",
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.text());
app.use(express.static(path.join(__dirname, "..", 'public')));
app.use(cors(corsOptions));

app.use('/api/users', userRouter);
app.use('/api/calendars', calendarRouter);
app.use('/api/requests', requestsRouter);

export const wss = new WebSocket.Server({ port: 3001 });
export const clientEmails: Map<string, WebSocket> = new Map();

wss.on('connection', (ws, req) => {
  console.log(`New WS Client connected, ${wss.clients.size} connected`);

  const currentWs = ws;

  ws.on('open', function open(email: string) {
    clientEmails.set(email, currentWs);
    console.log(`New connection opened, ${wss.clients.size} connected`);
  });

  ws.on('close', () => {
    clientEmails.forEach((client, email) => {
      if (client === ws) {
        clientEmails.delete(email);
      }
    });
    console.log(`Client disconnected, ${wss.clients.size} connected`)
  });

  ws.on('request', function request(fromTo: string) {
    const [fromEmail, toEmail] = fromTo.split(":");
    const client = clientEmails.get(toEmail);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(`New request from: ${fromEmail}`);
    }
  });

  ws.on('message', function message(msg) {
    const [command, ...data] = msg.toString().split(":");
    ws.emit(command, data.join(":"));
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

console.log("Backend-app running at http://localhost:3000/")
console.log("Websocket running at ws://localhost:3001/")

export default app;
