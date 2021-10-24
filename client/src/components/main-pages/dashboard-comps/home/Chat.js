import { If } from "../../../../utils/If";
import { ChatSettingsAcc } from "./ChatSettingsAcc";

import { post, get } from "../../../../utils/http";

import { useEffect } from "react";
import { useState, useContext } from "react";

import { getDateAndTime } from "../../../../utils/getDate&Time";

export const Chat = ({
  activeChatroom,
  setActiveChatroom,
  user,
  fetchLastMsg,
  setFetchLastMsg,
  send,
  // message,
  // messages,
  // setMessage,
  // setMessages,
  ws,
}) => {
  console.log(ws);
  // const [ws, setWs] = useState(
  //   new WebSocket(
  //     "ws://localhost:5002"
  //     // "ws://localhost:5002" + "/protected/get-chatroom/" + activeChatroom._id
  //   )
  // );

  // const ws = new WebSocket(
  //   "ws://localhost:5002"
  //   // "ws://localhost:5002" + "/protected/get-chatroom/" + activeChatroom._id
  // );
  const [Message, setmessage] = useState(null);
  const [Messages, setmessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");

  // const send = () => {
  //   // console.log('send');
  //   if (!message) return;

  //   ws.send(
  //     JSON.stringify({
  //       type: "message",
  //       sender: user._id,
  //       chatroom: activeChatroom._id,
  //       text: message,
  //       time: getDateAndTime(),
  //     })
  //   );

  //   // return setMessage("");
  //   // if (messages.length !== 0) {
  //   //   setMessages([...messages, message]);
  //   // }
  //   console.log(message);
  // };

  const msg = () => {
    // console.log('send');

    // if (ws)
    //   ws.send(
    //     JSON.stringify({
    //       type: "message",
    //       sender: user._id,
    //       chatroom: activeChatroom._id,
    //       text: message,
    //       time: getDateAndTime(),
    //     })
    //   );
    // let theMessage = {
    //   type: "message",
    //   sender: user._id,
    //   chatroom: activeChatroom._id,
    //   text: inputMessage,
    //   time: getDateAndTime(),
    // };

    setmessage({
      type: "message",
      sender: user._id,
      chatroom: activeChatroom._id,
      text: inputMessage,
      time: getDateAndTime(),
    });

    // return setMessage("");
    // if (messages.length !== 0) {
    //   setMessages([...messages, message]);
    // }
  };

  const fetchMessages = async (signal) => {
    let res = await get(
      `/protected/get-chatroom-messages/` + activeChatroom._id,
      signal
    );
    setmessages(res.data);
    setLoading(false);
  };

  useEffect(async () => {
    const abortController = new AbortController();
    if (activeChatroom !== null) await fetchMessages(abortController.signal);
    return () => abortController.abort();
  }, [activeChatroom, setmessages]);

  // useEffect(() => {
  //   ws.onmessage = (e) => {
  //     const message = JSON.parse(e.data);
  //     if (message.chatroom === activeChatroom._id) {
  //       setMessages([...messages, message]);
  //     }
  //   };
  // }, [ws]);

  if (loading) {
    <h4>loading ...</h4>;
  }

  useEffect(() => {
    // ws.onopen = () => {
    //   console.log("WebSocket Connected");
    // };
    console.log(Messages);

    if (ws) {
      ws.onmessage = async (e) => {
        // console.log("feasdasdasd");
        // setMessage(JSON.parse(e.data));

        let theMessage = JSON.parse(e.data);
        // console.log(theMessage);
        let resMessage;
        if (user._id === theMessage.sender) {
          resMessage = await post(`/protected/create-message`, theMessage);
        }
        console.log(resMessage);

        if (theMessage.chatroom === activeChatroom._id) {
          console.log(Messages);
          setmessages([...Messages, theMessage]);
          console.log("fetching all mesgs");
          // setFetchLastMsg(!fetchLastMsg);
        }
      };
    }
  }, [ws.onmessage]);

  useEffect(() => {
    if (Message && ws && ws.readyState === 1) {
      console.log("ok");
      ws.send(JSON.stringify(Message));
    }
  }, [Message]);
  console.log(Messages);
  // console.log(activeChatroom);
  return (
    <>
      <section className="flex chat-con-top">
        <div className="flex top-userinfo">
          <div className="userinfo-avatar">ava</div>
          {/* <div className="userinfo-name">{user.name}</div> */}
          <div className="top-userinfo-chatroom-name">
            {activeChatroom.name}
          </div>
        </div>
        <div className="flex top-settings">
          <div className="userinfo-avatar">...</div>
          {/* <ChatSettingsAcc /> */}
        </div>
      </section>

      <section className="height100 chat-con-mid">
        <If condition={Messages && Messages.length !== 0}>
          {Messages.reverse().map((m) => {
            return (
              <div
                className={
                  m.sender === user._id ? "message-right" : "message-left"
                }
              >
                {m.text}
              </div>
            );
          })}
        </If>
      </section>
      <section className="flex chat-con-bot">
        <div className="con-bot-con-message">
          <input
            placeholder="write message"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
        </div>

        <button type="button" onClick={() => msg()}>
          send
        </button>
      </section>
    </>
  );
};
