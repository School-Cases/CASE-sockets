import { useEffect, useState } from "react";

import { get, post } from "../../../../utils/http";
import { If } from "../../../../utils/If";

import styled from "styled-components";
const StyledSection = styled("section")`
  background: linear-gradient(
    235deg,
    ${(props) => props.theme} 25%,
    rgba(255, 255, 255, 1) 25%
  );
`;
const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;
const StyledSpan = styled("span")`
  background-color: ${(props) => props.color};
`;

export const HomeCol2 = ({
  ws,
  user,
  userChatrooms,
  notUserChatrooms,
  activeChatroom,
  setActiveChatroom,
  setHomeCol3State,
  chatroomLastMessage,
  chatroomUnreadMsgs,
  setChatroomUpdated,
  usersOnline,
  setMobileCol2Chatrooms,
}) => {
  // states
  const [searchChatrooms, setSearchChatrooms] = useState("");
  const [showOtherChatrooms, setShowOtherChatrooms] = useState(false);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  // fetches
  // const fetchDeleteChatrooms = async (signal) => {
  //   await get(`/protected/delete-all-chatrooms`, signal);
  // };
  // const fetchDeleteMSGS = async (signal) => {
  //   await get(`/protected/delete-all-messages`, signal);
  // };

  // height: calc(100% - 7rem);

  useEffect(() => {
    document.querySelector(
      ".dash-home-chatrooms"
    ).style.height = `calc(100% - 5rem - ${
      document.querySelector(".dash-home-usersonline").offsetHeight
    }px)`;
  }, [showOnlineUsers]);
  return (
    <>
      <section className="flex search-chatroom-con">
        <input
          type="text"
          placeholder="search chatrooms"
          onInput={(e) => setSearchChatrooms(e.target.value)}
        />

        <div className="flex">
          <label>all:</label>
          <input
            type="checkbox"
            onChange={(e) => setShowOtherChatrooms(e.target.checked)}
          />
        </div>
      </section>

      <section className="dash-home-usersonline">
        <div
          onClick={() => {
            setShowOnlineUsers(!showOnlineUsers);
          }}
        >
          Users online ({usersOnline.length}){" "}
          <If condition={!showOnlineUsers}>
            <i class="fas fa-caret-down"></i>
          </If>
          <If condition={showOnlineUsers}>
            <i class="fas fa-caret-up"></i>
          </If>
        </div>
        <If condition={showOnlineUsers}>
          {usersOnline.map((u) => {
            return (
              // <If condition={u._id !== user._id}>
              <div className="flex users-online-container">
                <StyledDiv
                  img={u.avatar}
                  className="con-online-avatar"
                ></StyledDiv>
                <div className="con-online-username">{u.name}</div>
              </div>
              // </If>
            );
          })}
        </If>
      </section>

      <section className="flex dash-home-chatrooms">
        {/* tillfälligt */}
        {/* <button
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
        </button> */}
        {/* --------- */}

        <div className="flex home-chatrooms-con">
          <If condition={!showOtherChatrooms}>
            {userChatrooms.map((room) => {
              return (
                <If condition={room.name.includes(searchChatrooms)}>
                  <Chatroom
                    joinable={false}
                    room={room}
                    user={user}
                    activeChatroom={activeChatroom}
                    setActiveChatroom={setActiveChatroom}
                    setHomeCol3State={setHomeCol3State}
                    chatroomLastMessage={chatroomLastMessage}
                    chatroomUnreadMsgs={chatroomUnreadMsgs}
                    ws={ws}
                    setMobileCol2Chatrooms={setMobileCol2Chatrooms}
                    usersOnline={usersOnline}
                  />
                </If>
              );
            })}
          </If>

          <If condition={showOtherChatrooms}>
            {notUserChatrooms.map((room) => {
              return (
                <If condition={room.name.includes(searchChatrooms)}>
                  <Chatroom
                    joinable={true}
                    room={room}
                    user={user}
                    ws={ws}
                    setChatroomUpdated={setChatroomUpdated}
                  />
                </If>
              );
            })}
          </If>
        </div>
      </section>

      <button
        onClick={() => {
          setHomeCol3State("createChatroom");
          setMobileCol2Chatrooms(false);
        }}
      >
        create
      </button>
    </>
  );
};

const Chatroom = ({
  joinable,
  room,
  activeChatroom,
  setActiveChatroom,
  user,
  setHomeCol3State,
  chatroomLastMessage,
  chatroomUnreadMsgs,
  setChatroomUpdated,
  ws,
  setMobileCol2Chatrooms,
  usersOnline,
}) => {
  // states
  const [loading, setLoading] = useState(true);

  const [lastMessage, setLastMessage] = useState(false);
  const [roomUnreadMsgs, setRoomUnreadMsgs] = useState(0);
  const [nollifyUnreadMsgs, setNollifyUnreadMsgs] = useState(false);

  // fetches
  const fetchLastMessage = async (signal) => {
    console.log("lol");
    let res = await get(
      `/protected/get-chatroom-last-message/${room._id}`,
      signal
    );

    setLastMessage(res.data);
    if (room !== activeChatroom) {
      return fetchGetChatroomUnread(signal);
    } else {
      setLoading(false);
    }
  };

  const fetchStarmarkChatroom = async () => {
    await post(`/protected/starmark-chatroom/${room._id}/${user._id}`);
  };

  const fetchUpdateChatroomUnread = async () => {
    let res = await post(`/protected/update-chatroom-unread`, {
      chatroomId: room._id,
      userId: user._id,
      nollify: nollifyUnreadMsgs,
    });
    setRoomUnreadMsgs(res.data);
  };

  const fetchGetChatroomUnread = async (signal) => {
    let res = await get(
      `/protected/get-chatroom-unread/${user._id}/${room._id}`,
      signal
    );

    setRoomUnreadMsgs(res.data.unread);
    setLoading(false);
  };

  const fetchJoinChatroom = async () => {
    let res = await post(`/protected/join-chatroom`, {
      chatroomId: room._id,
      userId: user._id,
    });

    ws.send(
      JSON.stringify({
        type: "chatroomUpdate",
        detail: "userJoined",
        chatroomId: room._id,
        user: user,
      })
    );

    setChatroomUpdated(true);
  };

  // useEffects
  useEffect(async () => {
    if (!joinable) {
      const abortController = new AbortController();
      await fetchLastMessage(abortController.signal);
      return () => abortController.abort();
    }
  }, []);

  useEffect(async () => {
    if (chatroomLastMessage) {
      if (!joinable && chatroomLastMessage.chatroom === room._id) {
        const abortController = new AbortController();
        await fetchLastMessage(abortController.signal);
        return () => abortController.abort();
      }
    }
  }, [chatroomLastMessage]);

  useEffect(async () => {
    if (chatroomUnreadMsgs || nollifyUnreadMsgs) {
      if (
        (!joinable && nollifyUnreadMsgs) ||
        (!joinable && chatroomUnreadMsgs.chatroom === room._id)
      ) {
        const abortController = new AbortController();
        await fetchUpdateChatroomUnread(abortController.signal);
        return () => abortController.abort();
      }
    }
  }, [chatroomUnreadMsgs, nollifyUnreadMsgs]);

  if (loading) {
    <h4>loading ...</h4>;
  }

  return (
    <>
      <If condition={!joinable}>
        <StyledSection
          theme={room.theme}
          className={`col2-chatroom-con ${
            activeChatroom === room ? "active" : ""
          }`}
          onClick={async () => {
            setActiveChatroom(room);
            setHomeCol3State("chat");
            setMobileCol2Chatrooms(false);
            if (roomUnreadMsgs > 0) {
              setNollifyUnreadMsgs(true);
            }
          }}
        >
          <div className="flex chatroom-con-title-fav-con">
            <div className="flex fav-con-name-admin">
              <div className="flex">
                <h5>{room.name}</h5>
                <If condition={room.admins.includes(user._id)}>
                  <div className="fav-con-admin-icon">A</div>
                </If>
              </div>
            </div>
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
          {lastMessage ? (
            <div className="flex chatroom-con-mes">
              <StyledDiv
                img={lastMessage.user.avatar}
                className="con-mes-avatar"
              >
                <div className="onlinestatus-con">
                  <StyledSpan
                    color={
                      usersOnline.filter(
                        (user) => user._id === lastMessage.user._id
                      ).length > 0
                        ? "#A2DC68"
                        : "#FF997D"
                    }
                    className="user-con-onlinestatus"
                  ></StyledSpan>
                </div>
              </StyledDiv>
              <div>
                <div className="con-mes-message">
                  {lastMessage.message.text}
                </div>
                <div className="con-mes-message-time">
                  {lastMessage.message.time}
                </div>
              </div>
            </div>
          ) : (
            <div className="con-mes-no-message">no messages</div>
          )}
          <div className="new-message-container">
            <div className="new-messages-icon">{roomUnreadMsgs}</div>
          </div>
        </StyledSection>
      </If>
      <If condition={joinable}>
        <StyledSection className="col2-chatroom-con" theme={room.theme}>
          <div className="flex chatroom-con-title-fav-con">
            <h5>{room.name}</h5>
          </div>
          <button onClick={() => fetchJoinChatroom()}>JOIN</button>
        </StyledSection>
      </If>
    </>
  );
};
