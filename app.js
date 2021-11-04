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

import {
  removeUserFromUsersOnline,
  getValueFromKey,
} from "./utils/usersOnline";

import { messageModel } from "./Models/message-model";
import { chatroomModel } from "./Models/chatroom-model";

import { create_message } from "./Controllers/message-controller";

import { URL } from "url";

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

const emitMessage = (data, isBinary) => {
  wss.clients.forEach(function each(client) {
    if (client !== WebSocket && client.readyState === WebSocket.OPEN) {
      client.send(data, { binary: isBinary });
    }
  });
};

let usersOnline = [];
wss.on("connection", (ws, req) => {
  // setInterval(() => {
  //   wss.clients.forEach((client) => {
  //     client.send(JSON.stringify("ah ah ah stay alive!"));
  //   });
  // }, 28000);
  console.log("Client connected from IP: ", ws._socket.remoteAddress);
  console.log("Number of connected clients: ", wss.clients.size);

  let user = getValueFromKey(req.url, "user");
  if (user !== "undefined") {
    usersOnline.push(user);
    let obj = { type: "usersOnline", users: usersOnline };

    wss.broadcast(JSON.stringify(obj), ws);
  }

  ws.on("close", (event) => {
    console.log("Client disconnected\n");
    console.log("Number of clients: ", wss.clients.size);

    usersOnline = removeUserFromUsersOnline(user, usersOnline);

    let obj = {
      type: "usersOnline",
      users: usersOnline,
    };
    wss.broadcast(JSON.stringify(obj));
  });

  ws.on("message", async (data, isBinary) => {
    const event = JSON.parse(data);

    switch (event.type) {
      case "message":
        switch (event.detail) {
          case "message":
            try {
              console.log(event);
              let message = await new messageModel({
                chatroom: event.chatroom,
                sender: event.sender,
                time: event.time,
                text: event.text,
                reactions: [],
              });
              let MaM = message;
              message = message.save();

              await chatroomModel.findByIdAndUpdate(event.chatroom, {
                $push: {
                  messages: message._id,
                },
              });

              let sendData = JSON.parse(data.toString());
              sendData._id = MaM._id;
              // JSON.stringify(sendData);
              // JSON.parse(data.toString())._id = MaM._id;

              return emitMessage(JSON.stringify(sendData), isBinary);
              // return emitMessage(data.toString(), isBinary);
              // return res.json({
              //   message: "create message success",
              //   success: true,
              //   data: MaM,
              // });
            } catch (err) {
              return;
              // res.json({
              //   message: "create message fail",
              //   success: false,
              //   data: null,
              // });
            }

          case "userJoined":
            try {
              console.log(event);
              let message = await new messageModel({
                chatroom: event.chatroom,
                sender: event.sender,
                time: event.time,
                text: event.text,
                reactions: [],
              });
              let MaM = message;
              message = message.save();

              await chatroomModel.findByIdAndUpdate(event.chatroom, {
                $push: {
                  messages: message._id,
                },
              });

              let sendData = JSON.parse(data.toString());
              sendData._id = MaM._id;
              // JSON.stringify(sendData);
              // JSON.parse(data.toString())._id = MaM._id;

              return emitMessage(JSON.stringify(sendData), isBinary);
              // return emitMessage(data.toString(), isBinary);
              // return res.json({
              //   message: "create message success",
              //   success: true,
              //   data: MaM,
              // });
            } catch (err) {
              return;
              // res.json({
              //   message: "create message fail",
              //   success: false,
              //   data: null,
              // });
            }
        }

      case "reaction":
        return emitMessage(data.toString(), isBinary);

      case "isTyping":
        return emitMessage(data.toString(), isBinary);

      case "userJoined":
        return emitMessage(data.toString(), isBinary);
    }
  });
});
wss.broadcast = (data) => {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};
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
