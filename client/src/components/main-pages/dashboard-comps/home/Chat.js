import { If } from "../../../../utils/If";
import { ChatSettingsAcc } from "./ChatSettingsAcc";

export const Chat = ({
  activeChatroom,
  user,
  messages,
  message,
  setMessage,
  send,
}) => {
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
