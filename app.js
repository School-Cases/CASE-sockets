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
import path from "path";

import { messageModel } from "./Models/message-model";
import { chatroomModel } from "./Models/chatroom-model";

import { create_message } from "./Controllers/message-controller";

import { URL } from "url"; // in Browser, the URL in native accessible on window

const __filename = new URL("", import.meta.url).pathname;
const __dirname = new URL(".", import.meta.url).pathname;

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
// dev
app.use("/", express.static("./client/public"));
app.use("/static", express.static("./public/static"));
// heroku
// app.use(express.static(path.join(__dirname, "/client/build")));

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
  // setInterval(() => {
  //   wss.clients.forEach((client) => {
  //     client.send(JSON.stringify("ah ah ah stay alive!"));
  //   });
  // }, 28000);
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
        try {
          let message = await new messageModel({
            chatroom: event.chatroom,
            sender: event.sender,
            time: event.time,
            text: event.text,
          });
          let MaM = message;
          message = message.save();

          await chatroomModel.findByIdAndUpdate(event.chatroom, {
            $push: {
              messages: message._id,
            },
          });

          return emitMessage(data.toString(), isBinary);
          // return emitMessage(data.toString(), isBinary);
          // return res.json({
          //   message: "create message success",
          //   success: true,
          //   data: MaM,
          // });
        } catch (err) {
          return res.json({
            message: "create message fail",
            success: false,
            data: null,
          });
        }

      case "roomsUpdate":
        return emitMessage(data.toString(), isBinary);
    }
    // await create_message(data, );
    // emitMessage(data.toString(), isBinary);
  });
  // ws.on("message", async (data, isBinary) => {
  //   // console.log(data.toString(), isBinary);
  //   console.log(JSON.parse(data), isBinary);
  //   const event = JSON.parse(data);
  //   // await create_message(event, res);

  //   switch (event.type) {
  //     case "message":
  //       return emitMessage(event.toString(), isBinary);
  //   }

  //   // emitMessage(data.toString(), isBinary);
  // });
});
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/client/build/index.html"));
// });
app.get("*", (req, res) =>
  res.sendFile("index.html", {
    root: "./client/public",
  })
);

// server.listen(process.env.PORT, () => {
//   console.log("Server lyssnar på port", process.env.PORT);
// });
server.listen(process.env.PORT || 5002, () => {
  console.log("Server lyssnar på port", process.env.PORT);
});
