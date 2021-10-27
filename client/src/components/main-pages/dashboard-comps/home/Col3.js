import { Chat } from "./Chat";
import { CreateChatroom } from "./CreateChatroom";

export const Col3 = ({
  user,
  activeChatroom,
  setActiveChatroom,
  ws,
  createChatroom,
  setCreateChatroom,
  fetchChatrooms,
  // fetchLastMsg,
  // setFetchLastMsg,
  send,
  // message,
  // messages,
  // setMessage,
  // setMessages,
}) => {
  return (
    <section className="flex height100 col3-chat-con">
      {createChatroom ? (
        <CreateChatroom
          fetchChatrooms={fetchChatrooms}
          setCreateChatroom={setCreateChatroom}
          createChatroom={createChatroom}
          user={user}
          ws={ws}
        />
      ) : (
        <>
          {activeChatroom !== null ? (
            <Chat
              activeChatroom={activeChatroom}
              setActiveChatroom={setActiveChatroom}
              user={user}
              // fetchLastMsg={fetchLastMsg}
              // setFetchLastMsg={setFetchLastMsg}
              // send={send}
              // message={message}
              // setMessage={setMessage}
              // messages={messages}
              // setMessages={setMessages}
              ws={ws}
            />
          ) : (
            <>
              <button
                className="create-chatroom-button"
                onClick={() => setCreateChatroom(true)}
              >
                create chatroom
              </button>
            </>
          )}
        </>
      )}
    </section>
  );
};
