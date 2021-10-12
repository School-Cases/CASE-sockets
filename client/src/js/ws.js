// import functions
import { parse } from "../utils/parse";
import { addMessage } from "../utils/addMessage";
import { api_address } from "../utils/http";

export const WS = () => {
  // use WebSocket
  const websocket = new WebSocket("ws://localhost:5002");

  console.log("ws");

  // listen on close event
  websocket.addEventListener("close", (event) => {
    console.log("Server down...", event);
  });

  // listen to message event
  websocket.addEventListener("message", ({ data }) => {
    console.log("Message from server: ", data);

    let obj = parse(data);

    console.log(obj);

    // use property 'type' to handle message event
    //   switch (obj.type) {
    //     case "chat":
    //       // display message to client(s)
    //       addMessage(obj.data.nickname, obj.data.text, new Date(obj.data.date));
    //       break;

    //     default:
    //       break;
    //   }
  });

  // variables and event listeners
  // let nickname;

  // const inputNickname = document.getElementById("inputNickname");
  // const buttonNickname = document.getElementById("buttonNickname");
  // const inputText = document.getElementById("inputText");

  // inputNickname.focus();

  // buttonNickname.addEventListener("click", () => {
  //   nickname = inputNickname.value;
  //   if (nickname.length > 2) {
  //     // disable element
  //     inputNickname.setAttribute("disabled", "disabled");

  //     // hide button
  //     buttonNickname.classList.toggle("hidden");

  //     // display field for new text messages - focus element to set a cursor
  //     inputText.classList.toggle("hidden");
  //     inputText.focus();
  //   }
  // });

  // inputText.addEventListener("keydown", (event) => {
  //   // add message when Enter key is pressed
  //   if (event.code === "Enter" && inputText.value.length > 0) {
  //     let date = new Date();

  //     // add message to DOM
  //     addMessage(nickname, inputText.value, date);

  //     // send to websocket server
  //     let obj = {
  //       type: "chat",
  //       data: { nickname: nickname, text: inputText.value, date: date },
  //     };
  //     websocket.send(JSON.stringify(obj));

  //     // clear
  //     inputText.value = "";
  //   }
  // });
};

// // use WebSocket
//   const websocket = new WebSocket("ws://localhost:5002");
//   console.log("ws");

//   websocket.addEventListener("close", (event) => {
//     console.log("Server down...", event);
//   });
//   websocket.addEventListener("message", ({ data }) => {
//     console.log("Message from server: ", data);

//     let obj = parse(data);

//     console.log(obj);
//   });
// };
