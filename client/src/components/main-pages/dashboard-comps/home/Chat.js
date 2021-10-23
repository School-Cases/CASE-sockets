import { If } from "../../../../utils/If";
import { ChatSettingsAcc } from "./ChatSettingsAcc";

import { post, get } from "../../../../utils/http";

import { useEffect } from "react";
import { useState } from "react";

import { getDateAndTime } from "../../../../utils/getDate&Time";

export const Chat = ({ activeChatroom, user }) => {
  // const [ws, setWs] = useState(
  //   new WebSocket(
  //     "ws://localhost:5002"
  //     // "ws://localhost:5002" + "/protected/get-chatroom/" + activeChatroom._id
  //   )
  // );

  const ws = new WebSocket(
    "ws://localhost:5002"
    // "ws://localhost:5002" + "/protected/get-chatroom/" + activeChatroom._id
  );
  console.log(activeChatroom);
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(true);

  const send = () => {
    if (!message) return;

    ws.send(
      JSON.stringify({
        sender: user._id,
        chatroom: activeChatroom._id,
        text: message,
        time: getDateAndTime(),
      })
    );

    // return setMessage("");
    // if (messages.length !== 0) {
    //   setMessages([...messages, message]);
    // }
    console.log(message);
  };

  const fetchMessages = async (signal) => {
    let res = await get(
      `/protected/get-chatroom-messages/` + activeChatroom._id,
      signal
    );
    setMessages(res.data);
    setLoading(false);
  };

  useEffect(async () => {
    const abortController = new AbortController();
    if (activeChatroom !== null) await fetchMessages(abortController.signal);
    return () => abortController.abort();
  }, [activeChatroom]);

  if (loading) {
    <h4>loading ...</h4>;
  }

  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = async (e) => {
      // setMessage(JSON.parse(e.data));

      let Message = JSON.parse(e.data);

      console.log(Message);
      if (user._id === Message.sender) {
        await post(`/protected/create-message`, Message);
      }

      if (Message.chatroom === activeChatroom._id) {
        setMessages([...messages, Message]);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      // setWs(
      //   new WebSocket(
      //     "ws://localhost:5002"
      //     // "ws://localhost:5002" +
      //     //   "/protected/get-chatroom/" +
      //     //   activeChatroom._id
      //   )
      // );
    };
  }, [ws.onmessage, ws.onopen, messages, ws.onclose]);

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
        <If condition={messages && messages.length !== 0}>
          {messages.reverse().map((m) => {
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
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button type="button" onClick={() => send()}>
          send
        </button>
      </section>
    </>
  );
};
