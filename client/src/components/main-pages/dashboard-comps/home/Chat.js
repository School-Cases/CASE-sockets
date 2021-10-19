export const Chat = ({
  activeChatroom,
  user,
  messages,
  message,
  setMessage,
  send,
}) => {
  return (
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
              console.log(m);
              return (
                <div
                  className={
                    m.sender === user._id ? "message-right" : "message-left"
                  }
                >
                  {m.text}
                </div>
              );
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
  );
};
