import React from "react";
import { useEffect, useState, useContext } from "react";
import { api_address, post, get } from "../../../../utils/http";

import styled from "styled-components";

import { If } from "../../../../utils/If";

const StyledSection = styled("section")`
  background: linear-gradient(
    235deg,
    ${(props) => props.theme} 25%,
    rgba(255, 255, 255, 1) 25%
  );
`;

const LastMsgContext = React.createContext("");

export const ChatroomsHome = ({
  user,
  userChatrooms,
  joinableChatrooms,
  searchChatrooms,
  // activeChatroom,
  setActiveChatroom,
  searchJoinableChatroomsCheckbox,
  setCreateChatroom,
  fetchLastMsg,
  setFetchLastMsg,
}) => {
  const fetchDeleteChatrooms = async (signal) => {
    await get(`/protected/delete-all-chatrooms`, signal);
  };
  const fetchDeleteMSGS = async (signal) => {
    await get(`/protected/delete-all-messages`, signal);
  };

  return (
    <section className="flex dash-home-chatrooms">
      <button
        onClick={() => {
          const abortController = new AbortController();
          fetchDeleteChatrooms(abortController.signal);
          return () => abortController.abort();
        }}
      >
        delete chatrooms
      </button>
      <button
        onClick={() => {
          const abortController = new AbortController();
          fetchDeleteMSGS(abortController.signal);
          return () => abortController.abort();
        }}
      >
        delete msgs
      </button>
      <div className="flex home-chatrooms-con">
        {/* korta ner detta */}

        {searchJoinableChatroomsCheckbox === false
          ? userChatrooms.map((room) => {
              return (
                <If condition={room.name.includes(searchChatrooms)}>
                  <Chatroom
                    joinable={"notJoinable"}
                    // activeChatroom={activeChatroom}
                    setActiveChatroom={setActiveChatroom}
                    room={room}
                    user={user}
                    setCreateChatroom={setCreateChatroom}
                    fetchLastMsg={fetchLastMsg}
                    setFetchLastMsg={setFetchLastMsg}
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

// const LastMsgContext = React.createContext();

const Chatroom = ({
  joinable,
  room,
  setActiveChatroom,
  user,
  setCreateChatroom,
  // activeChatroom,
  fetchLastMsg,
  setFetchLastMsg,
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
    // console.log("LAST ", lastMessage.data);

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
    console.log("fetch starmark");

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
  }, [fetchLastMsg]);

  if (loading) {
    <h4>loading ...</h4>;
  }

  return (
    <>
      {joinable === "notJoinable" ? (
        <StyledSection
          theme={room.theme}
          className="col2-chatroom-con"
          onClick={() => {
            setActiveChatroom(room);
            setCreateChatroom(false);
          }}
        >
          <div className="flex chatroom-con-title-fav-con">
            <h5>{room.name}</h5>
            <If condition={room.admins.includes(user._id)}>
              <div>A</div>
            </If>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                className={`${
                  room.starmarked.includes(user._id) ? "starmarked" : ""
                } title-fav-con-fav`}
                onClick={(e) => {
                  e.target.classList.toggle("starmarked");
                  fetchStarmarkChatroom();
                }}
                d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"
              />
            </svg>
          </div>
          {lastMessage !== null ? (
            <div className="flex chatroom-con-mes">
              {/* <Toolbar /> */}

              <div className="con-mes-avatar">{lastMessageSender.avatar}</div>
              {/* <div>
                  <div className="con-mes-message">{lastMessage.text}</div>
                  <div className="con-mes-message-time">{lastMessage.time}</div>
                </div> */}
              {/* <LastMsgContext.Provider value={lastMessage}>
                <LastMsgContext.Consumer>
                  {(value) => {
                    console.log(value);
                    return <LastMsg value={value} />;
                  }}
                </LastMsgContext.Consumer>
              </LastMsgContext.Provider> */}
              <LastMsg value={lastMessage} />
            </div>
          ) : (
            <div className="con-mes-no-message">no messages</div>
          )}
        </StyledSection>
      ) : (
        <StyledSection className="col2-chatroom-con" theme={room.theme}>
          <div className="flex chatroom-con-title-fav-con">
            <h5>{room.name}</h5>
          </div>
          <button onClick={() => fetchJoinChatroom()}>join</button>
        </StyledSection>
      )}
    </>
  );
};

export const LastMsg = ({ value }) => {
  // const msg = useContext(LastMsgContext);
  return (
    <div>
      <div className="con-mes-message">{value.text}</div>
      <div className="con-mes-message-time">{value.time}</div>
    </div>
  );
};
