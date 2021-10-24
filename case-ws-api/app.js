/** @format */

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import bcrypt from "bcrypt";
import http from "http";
import { parse } from "./utils/parse";
import WebSocket, { WebSocketServer } from "ws";
import { protectedMw } from "./middlewares/protected";
import protectedRouter from "./routers/protected";
import index from "./routers/index";

import { create_message } from "./Controllers/message-controller";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

(async () => {
  try {
    await mongoose.connect(process.env.DB_URI);

    console.log("MongoDB has connected");
  } catch (err) {
    console.log(err);
    process.exit();
  }
})();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(express.json());
app.use("/", express.static("./public"));
app.use("/static", express.static("./public/static"));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/", index);
app.use("/protected", protectedMw, protectedRouter);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
// const wss = new WebSocketServer({ noServer: true });

function emitMessage(data, isBinary) {
  wss.clients.forEach(function each(client) {
    if (client !== WebSocket && client.readyState === WebSocket.OPEN) {
      client.send(data, { binary: isBinary });
    }
  });
}

wss.on("connection", (ws) => {
  // console.log(ws);
  console.log("Client connected from IP: ", ws._socket.remoteAddress);
  console.log("Number of connected clients: ", wss.clients.size);

  // setTimeout(() => {
  //   console.log(wss.clients.size);
  // }, 5000);

  ws.on("close", (event) => {
    console.log("Client disconnected\n");
    console.log("Number of clients: ", wss.clients.size);
  });

  ws.on("message", async (data, isBinary) => {
    // console.log(data.toString(), isBinary);
    console.log(JSON.parse(data), isBinary);
    const event = JSON.parse(data);

    switch (event.type) {
      case "message":
        return emitMessage(data.toString(), isBinary);
    }
    // await create_message(data, );
    // emitMessage(data.toString(), isBinary);
  });
});

server.listen(process.env.PORT, () => {
  console.log("Server lyssnar på port", process.env.PORT);
});
