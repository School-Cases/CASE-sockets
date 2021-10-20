import { useEffect, useState } from "react";
import { api_address, post, get } from "../../../../utils/http";

import { If } from "../../../../utils/If";

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
              return (
                <If condition={room.name.includes(searchChatrooms)}>
                  <Chatroom
                    joinable={"notJoinable"}
                    setActiveChatroom={setActiveChatroom}
                    room={room}
                    user={user}
                    setCreateChatroom={setCreateChatroom}
                  />
                </If>
              );
            })
          : joinableChatrooms.map((room) => {
              return (
                <If condition={room.name.includes(searchChatrooms)}>
                  <Chatroom
                    joinable={"joinable"}
                    setActiveChatroom={setActiveChatroom}
                    room={room}
                    user={user}
                  />
                </If>
              );
            })}
      </div>
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

  const fetchStarmarkChatroom = async () => {
    await post(`/protected/starmark-chatroom/${room._id}/${user._id}`);
  };

  const fetchJoinChatroom = async () => {
    await post(`/protected/join-chatroom/${room._id}/${user._id}`);
  };

  useEffect(async () => {
    if (joinable === "notJoinable") {
      const abortController = new AbortController();
      await fetchLastMessage(abortController.signal);
      return () => abortController.abort();
    }
  }, []);

  if (loading) {
    <h4>loading ...</h4>;
  }

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
              className={`${
                room.starmarked.includes(user._id) ? "starmarked" : ""
              } title-fav-con-fav`}
              onClick={(e) => {
                e.target.classList.toggle("starmarked");
                fetchStarmarkChatroom();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/></svg>
            </div>
          </div>
          {lastMessage !== null ? (
            <div className="flex chatroom-con-mes">
              <div className="con-mes-avatar">{lastMessageSender.avatar}</div>

              <div>
                <div className="con-mes-message">{lastMessage.text}</div>
                <div className="con-mes-message-time">{lastMessage.time}</div>
              </div>
            </div>
          ) : (
            <div className="con-mes-no-message">no messages</div>
          )}
        </section>
      ) : (
        <section className="col2-chatroom-con">
          <div className="flex chatroom-con-title-fav-con">
            <h5>{room.name}</h5>
          </div>
          <button onClick={() => fetchJoinChatroom()}>join</button>
        </section>
      )}
    </section>
  );
};
