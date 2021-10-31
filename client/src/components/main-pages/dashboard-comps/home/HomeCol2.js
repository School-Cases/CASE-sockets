import { useEffect, useState } from "react";
import styled from "styled-components";

import { api_address, get, post } from "../../../../utils/http";
import { If } from "../../../../utils/If";

export const HomeCol2 = ({
  ws,
  user,
  userChatrooms,
  notUserChatrooms,
  activeChatroom,
  setActiveChatroom,
  setHomeCol3State,
  chatroomLastMessage,
  setChatroomLastMessage,
}) => {
  // states
  const [searchChatrooms, setSearchChatrooms] = useState("");
  const [showOtherChatrooms, setShowOtherChatrooms] = useState(false);

  // useEffects
  // useEffect(async () => {
  //   if (ws) {
  //     ws.onmessage = async (e) => {
  //       let data = JSON.parse(e.data);
  //       console.log(data);
  //       // if (!joinable) {
  //       //   if (
  //       //     data.type === "message" &&
  //       //     data.chatroom === room._id
  //       //     // && data.detail === "updateLastMessage"
  //       //   ) {
  //       //     setLoading(true);
  //       //     const abortController = new AbortController();
  //       //     await fetchLastMessage(abortController.signal);
  //       //     return () => abortController.abort();
  //       //   }
  //       // }
  //     };
  //   }
  // }, [ws.onmessage]);
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

      <section className="flex dash-home-chatrooms">
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
                    setChatroomLastMessage={setChatroomLastMessage}
                    // fetchLastMsg={fetchLastMsg}
                    // setFetchLastMsg={setFetchLastMsg}
                    // Messages={Messages}
                    // setmessages={setmessages}
                    ws={ws}
                  />
                </If>
              );
            })}
          </If>

          <If condition={showOtherChatrooms}>
            {notUserChatrooms.map((room) => {
              return (
                <If condition={room.name.includes(searchChatrooms)}>
                  <Chatroom joinable={true} room={room} user={user} ws={ws} />
                </If>
              );
            })}
          </If>
        </div>
      </section>

      <button
        onClick={() => {
          setHomeCol3State("createChatroom");
        }}
      >
        create
      </button>
    </>
  );
};

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

const Chatroom = ({
  joinable,
  room,
  activeChatroom,
  setActiveChatroom,
  user,
  setHomeCol3State,
  chatroomLastMessage,
  setChatroomLastMessage,
  // fetchLastMsg,
  ws,
}) => {
  const [lastMessage, setLastMessage] = useState(null);
  //   const [lastMessageSender, setLastMessageSender] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchLastMessage = async (signal) => {
    let res = await get(
      `/protected/get-chatroom-last-message/${room._id}`,
      signal
    );
    setLastMessage(res.data);
    setLoading(false);
  };

  const fetchStarmarkChatroom = async () => {
    console.log("fetch starmark");

    await post(`/protected/starmark-chatroom/${room._id}/${user._id}`);
  };

  const fetchJoinChatroom = async () => {
    let res = await post(`/protected/join-chatroom`, {
      chatroomId: room._id,
      userId: user._id,
    });
    console.log(res);
    // ws.send(
    //   JSON.stringify({
    //     type: "roomsUpdate",
    //   })
    // );
  };

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

  // useEffect(async () => {
  //   if (ws) {
  //     ws.onmessage = async (e) => {
  //       let data = JSON.parse(e.data);
  //       console.log(data);
  //       if (!joinable) {
  //         if (
  //           data.type === "message" &&
  //           data.chatroom === room._id
  //           // && data.detail === "updateLastMessage"
  //         ) {
  //           setLoading(true);
  //           const abortController = new AbortController();
  //           await fetchLastMessage(abortController.signal);
  //           return () => abortController.abort();
  //         }
  //       }
  //     };
  //   }
  // }, [ws.onmessage]);

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
          onClick={() => {
            setActiveChatroom(room);
            setHomeCol3State("chat");
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
              ></StyledDiv>
              <LastMsg value={lastMessage.message} />
            </div>
          ) : (
            <div className="con-mes-no-message">no messages</div>
          )}
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

export const LastMsg = ({ value }) => {
  return (
    <div>
      <div className="con-mes-message">{value.text}</div>
      <div className="con-mes-message-time">{value.time}</div>
    </div>
  );
};
