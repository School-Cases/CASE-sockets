import { useState, useEffect } from "react";
import { api_address, post, get } from "../../../../utils/http";
import { Chat } from "./Chat";
import { CreateChatroom } from "./CreateChatroom";

export const Col3 = ({
  user,
  activeChatroom,
  ws,
  message,
  setMessage,
  messages,
  setMessages,
  createChatroom,
  setCreateChatroom,
  fetchChatrooms,
}) => {
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

  const getDateAndTime = () => {
    let date = new Date().toLocaleDateString().split("-");
    let year = date[0].at(-2) + date[0].at(-1);
    if (date[1].at(0) === 0 && date[2].at(0) === 0) {
      let day = date[2];
      let month = date[1];
      date = `${day[1]}/${month[1]}`;
    } else if (date[1].at(0) === 0) {
      let month = date[1];
      date = `${date[2]}/${month[1]}`;
    } else if (date[2].at(0) === 0) {
      let day = date[2];
      date = `${day[1]}/${date[1]}`;
    } else {
      date = `${date[2]}/${date[1]}`;
    }
    let timeSplitted = new Date().toLocaleTimeString().split(":");
    let time = timeSplitted[0] + ":" + timeSplitted[1];
    return date + "-" + year + " " + time;
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

  return (
    <section className="flex height100 col3-chat-con">
      {createChatroom ? (
        <CreateChatroom
          fetchChatrooms={fetchChatrooms}
          setCreateChatroom={setCreateChatroom}
          createChatroom={createChatroom}
          user={user}
        />
      ) : (
        <>
          {activeChatroom !== null ? (
            <Chat
              activeChatroom={activeChatroom}
              user={user}
              messages={messages}
              message={message}
              setMessage={setMessage}
              send={send}
            />
          ) : (
            <>
              <button className="create-chatroom-button" onClick={() => setCreateChatroom(true)}>
                create chatroom
              </button>
            </>
          )}
        </>
      )}
    </section>
  );
};
