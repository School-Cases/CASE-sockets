import { useEffect, useState } from "react";
import { api_address, post, get } from "../../../../utils/http";

export const ChatroomsHome = ({
  user,
  userChatrooms,
  joinableChatrooms,
  searchChatrooms,
  setActiveChatroom,
  searchJoinableChatroomsCheckbox,
  setCreateChatroom,
}) => {
  return (
    <section className="flex dash-home-chatrooms">
      <div className="flex home-chatrooms-con">
        {/* korta ner detta */}
        {searchJoinableChatroomsCheckbox === false
          ? userChatrooms.map((room) => {
              return room.name.includes(searchChatrooms) ? (
                <Chatroom
                  joinable={"notJoinable"}
                  setActiveChatroom={setActiveChatroom}
                  room={room}
                  user={user}
                  setCreateChatroom={setCreateChatroom}
                />
              ) : null;
            })
          : joinableChatrooms.map((room) => {
              return room.name.includes(searchChatrooms) ? (
                <Chatroom
                  joinable={"joinable"}
                  setActiveChatroom={setActiveChatroom}
                  room={room}
                  user={user}
                />
              ) : null;
            })}
      </div>
<<<<<<< HEAD
      {/* <form action={api_address + "/create-chatroom"} method="post">
        <input type="text" name="name" id="" placeholder="chatroom name" />
        <input type="text" name="creater" id="" value={user._id} hidden />

        <button type="submit">create</button>
      </form> */}
=======
>>>>>>> b2de89e4bef37e0e8251060c018980af3584b308
    </section>
  );
};

const Chatroom = ({
  joinable,
  room,
  setActiveChatroom,
  user,
  setCreateChatroom,
}) => {
  const [lastMessage, setLastMessage] = useState({});
  const [lastMessageSender, setLastMessageSender] = useState({});

  const [loading, setLoading] = useState(true);

  const fetchLastMessage = async (signal) => {
    let lastMessage = await get(
      `/protected/get-message/${room.messages.at(-1)}`,
      signal
    );

    setLastMessage(lastMessage.data);

    if (lastMessage.data !== null) {
      let lastMessageSenderFetch = await get(
        `/protected/get-user/${lastMessage.data.sender}`,
        signal
      );
      setLastMessageSender(lastMessageSenderFetch.data);
    }
    setLoading(false);
  };

  if (loading) {
    <h4>loading ...</h4>;
  }

  useEffect(async () => {
    if (joinable === "notJoinable") {
      const abortController = new AbortController();
      await fetchLastMessage(abortController.signal);
      return () => abortController.abort();
    }
  }, []);
  return (
    <section>
      {joinable === "notJoinable" ? (
        <section
          className="col2-chatroom-con"
          onClick={() => {
            setActiveChatroom(room);
            setCreateChatroom(false);
          }}
        >
          <div className="flex chatroom-con-title-fav-con">
            <h5>{room.name}</h5>
            <div
              className="title-fav-con-fav"
              onClick={(e) => {
                console.log("sho", e.target);
              }}
            >
              O
            </div>
          </div>
          {lastMessage !== null ? (
            <div className="flex chatroom-con-mes">
              <div>{lastMessageSender.avatar}</div>

              <div>
                <div>{lastMessage.text}</div>
                <div>{lastMessage.time}</div>
              </div>
            </div>
          ) : (
            <div>no messages</div>
          )}
        </section>
      ) : (
        <section className="col2-chatroom-con">
          <div className="flex chatroom-con-title-fav-con">
            <h5>{room.name}</h5>
          </div>
          <button
            onClick={async () => {
              await post(`/protected/join-chatroom/${room._id}/${user._id}`);
            }}
          >
            join
          </button>
        </section>
      )}
    </section>
  );
};
