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
  createChatroom,
}) => {
  const [loading, setLoading] = useState(true);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomTheme, setNewRoomTheme] = useState(0);
  const [newRoomMembers, setNewRoomMembers] = useState([user._id]);
  const [searchUsersInput, setSearchUsersInput] = useState("");
  const [addableUsers, setAddableUsers] = useState([]);

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
    console.log("fetching messages");
    let res = await get(
      `/protected/get-chatroom-messages/` + activeChatroom._id,
      signal
    );
    setMessages(res.data);
    setLoading(false);
  };

  const fetchAllUsers = async (signal) => {
    let res = await get(`/protected/get-all-users`, signal);
    console.log(res, "re");

    // setAddableUsers(res.data.filter((u) => u._id !== user._id));
    setAddableUsers(res.data);
    setLoading(false);
  };

  const fetchCreateChatroom = async () => {
    // let res =
    await post(`/protected/create-chatroom`, {
      name: newRoomName,
      admins: user._id,
      members: newRoomMembers,
      theme: newRoomTheme,
    });
    // console.log(res, "ress");

    // setAddableUsers(res.data.filter((u) => u._id !== user._id));
    // setAddableUsers(res.data);
    // setLoading(false);
  };

  useEffect(async () => {
    const abortController = new AbortController();
    // if (activeChatroom)
    if (activeChatroom !== null) await fetchMessages(abortController.signal);
    return () => abortController.abort();
  }, [activeChatroom]);

  useEffect(async () => {
    const abortController = new AbortController();
    // if (activeChatroom)
    if (createChatroom) await fetchAllUsers(abortController.signal);
    return () => abortController.abort();
  }, [createChatroom]);

  if (loading) {
    <h4>loading ...</h4>;
  }

  return (
    <section className="flex height100 col3-chat-con">
      {createChatroom ? (
        <section>
          <h3>create a chatrum</h3>
          <input
            type="text"
            name="name"
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <input type="text" name="theme" value={newRoomTheme} />

          <div>color:</div>
          <div className="flex">
            <div onClick={() => setNewRoomTheme(0)}>röd</div>
            <div onClick={() => setNewRoomTheme(1)}>grön</div>
            <div onClick={() => setNewRoomTheme(2)}>blå</div>
            <div onClick={() => setNewRoomTheme(3)}>orange</div>
            <div onClick={() => setNewRoomTheme(4)}>svart</div>
          </div>

          <label htmlFor="">add ppl:</label>
          <input
            type="text"
            placeholder="search user"
            onChange={(e) => setSearchUsersInput(e.target.value)}
          />
          <div className="flex">
            {searchUsersInput !== ""
              ? addableUsers.map((m) => {
                  return m.name.includes(searchUsersInput) ? (
                    <div
                      onClick={() => {
                        setNewRoomMembers((prev) => [...prev, m._id]);
                      }}
                    >
                      {m.name} <span>+</span>
                    </div>
                  ) : null;
                })
              : null}
          </div>
          <button onClick={() => fetchCreateChatroom()}>create it</button>
        </section>
      ) : (
        <section>
          {activeChatroom !== null ? (
            <section>
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
                      return <div>{m.text}</div>;
                    })
                  : null}
              </section>
              <section className="chat-con-bot">
                <div>
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
          ) : (
            <section>
              <h3>create chatroom</h3>
              <h3>join chatroom</h3>
            </section>
          )}
        </section>
      )}
    </section>
  );
};
