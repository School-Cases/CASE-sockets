import { useState, useEffect } from "react";
import { api_address, post, get } from "../../../../utils/http";

export const ChatHome = ({
  user,
  activeChatroom,
  ws,
  message,
  setMessage,
  messages,
  setMessages,
  // fetchMessages,
}) => {
  // const [message, setMessage] = useState("");
  // const [chatroomMessages, setChatroomMessages] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loading2, setLoading2] = useState(true);

  // use WebSocket
  // const websocket = new WebSocket(
  //   "ws://localhost:5002" + "/get-chatroom/" + activeChatroom._id
  // );

  // websocket.addEventListener("close", (event) => {
  //   console.log("Server down...", event);
  // });

  // websocket.addEventListener("message", async (data) => {
  //   console.log("Message from server: ", JSON.parse(data.data));

  //   let res = await post(`/create-message`, JSON.parse(data.data));
  //   console.log(res);

  //   // if (chatroomMessages.length !== 0) {
  //   //   setChatroomMessages([...chatroomMessages, JSON.parse(data.data)]);
  //   // }
  // });

  const send = () => {
    if (!message) return;

    ws.send(
      JSON.stringify({
        sender: user._id,
        chatroom: activeChatroom._id,
        text: message,
      })
    );

    // return setMessage("");
    // if (messages.length !== 0) {
    //   setMessages([...messages, message]);
    // }
    console.log(message);
  };

  const fetchMessages = async (signal) => {
    let res = await get(`/get-chatroom-messages/` + activeChatroom._id, signal);
    console.log(res.data);
    // setChatroomMessages(res.data);
    setMessages(res.data);
    // setLoading(false);
  };

  useEffect(async () => {
    const abortController = new AbortController();
    console.log(activeChatroom.length);
    if (activeChatroom) await fetchMessages(abortController.signal);
    return () => abortController.abort();
  }, [activeChatroom]);

  if (loading) {
    <h4>loading ...</h4>;
  }

  return (
    <section className="flex height100 col3-chat-con">
      <section className="flex chat-con-top">
        <div className="flex top-userinfo">
          <div className="userinfo-avatar">ava</div>
          <div className="userinfo-name">{user.name}</div>
          <div>{activeChatroom.name}</div>
        </div>
        <div className="flex top-settings">
          <div className="userinfo-avatar">...</div>
        </div>
      </section>

      <section className="height100 chat-con-mid">
        {messages && messages.length !== 0
          ? messages.reverse().map((m) => {
              // console.log(m);
              return <div>{m.text}</div>;
            })
          : null}
        {/* {chatroomMessages && chatroomMessages.length !== 0
          ? chatroomMessages.map((m) => {
              console.log(m);
              return <div>{m.text}</div>;
            })
          : null} */}
      </section>
      <section className="chat-con-bot">
        <div className="flex send-message-con">
          <input
            placeholder="write message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="button" onClick={() => send()}>
            send
          </button>
        </div>
      </section>
    </section>
  );
};
