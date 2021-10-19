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
  // const [newRoomName, setNewRoomName] = useState("");
  // const [newRoomTheme, setNewRoomTheme] = useState(0);
  // const [newRoomMembers, setNewRoomMembers] = useState([user._id]);

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
    let res = await get(
      `/protected/get-chatroom-messages/` + activeChatroom._id,
      signal
    );
    setMessages(res.data);
    setLoading(false);
  };

  // const fetchAllUsers = async (signal) => {
  //   let res = await get(`/protected/get-all-users`, signal);

  //   setAddableUsers(res.data);
  //   setLoading(false);
  // };

  // const fetchCreateChatroom = async () => {
  //   await post(`/protected/create-chatroom`, {
  //     name: newRoomName,
  //     admins: [user._id],
  //     members: newRoomMembers,
  //     theme: newRoomTheme,
  //   });
  //   setCreateChatroom(false);
  //   const abortController = new AbortController();
  //   fetchChatrooms(abortController.signal, user._id);
  //   return () => abortController.abort();
  // };

  useEffect(async () => {
    const abortController = new AbortController();
    if (activeChatroom !== null) await fetchMessages(abortController.signal);
    return () => abortController.abort();
  }, [activeChatroom]);

  // useEffect(async () => {
  //   const abortController = new AbortController();
  //   if (createChatroom) await fetchAllUsers(abortController.signal);
  //   return () => abortController.abort();
  // }, [createChatroom]);

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
          // setNewRoomName={setNewRoomName}
          // setNewRoomTheme={setNewRoomTheme}
          // newRoomTheme={newRoomTheme}
          // setNewRoomMembers={setNewRoomMembers}
          // addableUsers={addableUsers}
          // fetchCreateChatroom={fetchCreateChatroom}
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
              <button onClick={() => setCreateChatroom(true)}>
                create chatroom
              </button>
            </>
          )}
        </>
      )}
    </section>
  );
};
