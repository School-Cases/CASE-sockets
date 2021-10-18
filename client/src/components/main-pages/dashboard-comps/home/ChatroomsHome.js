import { useEffect, useState } from "react";
import { api_address, post, get } from "../../../../utils/http";

export const ChatroomsHome = ({
  user,
  userChatrooms,
  joinableChatrooms,
  searchChatrooms,
  setActiveChatroom,
  searchJoinableChatroomsCheckbox,
}) => {
  return (
    <section className="flex dash-home-chatrooms">
      <div>
        {/* korta ner detta */}
        {searchJoinableChatroomsCheckbox === false
          ? userChatrooms.map((room) => {
              return room.name.includes(searchChatrooms) ? (
                <Chatroom
                  joinable={"notJoinable"}
                  setActiveChatroom={setActiveChatroom}
                  room={room}
                  user={user}
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
    </section>
  );
};

const Chatroom = ({ joinable, room, setActiveChatroom, user }) => {
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
          }}
        >
          <div className="flex chatroom-con-title-fav-con">
            <h5>{room.name}</h5>
            <div className="title-fav-con-fav">O</div>
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
