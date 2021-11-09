import { useEffect, useState } from "react";

// import { BsEmojiSmileUpsideDown } from "react-icons/bs";

import { get, post } from "../../../../utils/http";
import { If } from "../../../../utils/If";
import { getDateAndTime } from "../../../../utils/getDate&Time";

import styled from "styled-components";
import { HomeCol3ChatSettings } from "./HomeCol3ChatSettings";
const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;

const StyledSpan = styled("span")`
  background-color: ${(props) => props.color};
`;

const StyledSection = styled("section")`
  background-color: ${(props) => props.color};
`;

export const HomeCol3Chat = ({
  ws,
  user,
  activeChatroom,
  setActiveChatroom,
  chatroomMessages,
  setChatroomMessages,
  newReaction,
  setNewReaction,
  membersTyping,
  usersOnline,
  setChatroomUpdated,
  setHomeCol3State,
}) => {
  // states
  const [loading, setLoading] = useState(true);

  const [chatroomUsers, setChatroomUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [msgAva, setMsgAva] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const [chatState, setChatState] = useState(true);

  const [showGoBotArrow, setShowGoBotArrow] = useState(false);
    const [chatScrollTop, setChatScrollTop] = useState(null);

  // fetches
  const fetchChatroomUsersAndMessages = async (signal) => {
    setLoading(true);
    let res = await get(
      `/protected/get-chatroom-users/${activeChatroom._id}`,
      signal
    );
    setChatroomUsers(res.data);

    return fetchChatroomMessages(signal);
  };

  const fetchChatroomMessages = async (signal) => {
    let res2 = await get(
      `/protected/get-chatroom-messages/${activeChatroom._id}`,
      signal
    );
    filterMsgsAva(res2.data);
    setChatroomMessages(res2.data);
    setLoading(false);
  };

  const fetchChatroomUsers = async (signal) => {
    let res = await get(
      `/protected/get-chatroom-users/${activeChatroom._id}`,
      signal
    );
    setChatroomUsers(res.data);
  };

  //   functions

  const handleKeyPress = (e) => {
  if (e.key === 'Enter' && inputMessage !== "") 
    sendMessage();
}

  const sendMessage = () => {
    if (ws && ws.readyState === 1)
      ws.send(
        JSON.stringify({
          type: "message",
          detail: "message",
          sender: user,
          // senderName: user.name,
          // senderAva: user.avatar,
          chatroom: activeChatroom._id,
          reactions: [],
          text: inputMessage,
          time: getDateAndTime(),
        })
      );
    setInputMessage("");
    setIsTyping(false);
  };

  const filterMsgsAva = (msgs) => {
    let arr = [];
    for (let i = 0; i < msgs.length; i++) {
      if (msgs[i + 1]) {
        if (
          msgs[i].sender._id !== msgs[i + 1].sender._id ||
          (msgs[i].sender._id === msgs[i + 1].sender._id &&
            msgs[i + 1].msgType === "userUpdate")
        ) {
          arr.push(msgs[i]);
        }
      } else {
        arr.push(msgs[i]);
      }
    }
    setMsgAva(arr);
  };

  // const checkIfGoBotArrow = (el) => {
  //   setChatScrollTop(el.scrollTop);
  //   console.log(el.scrollTop);

  // }
   const handleScroll = (e) => {
    const bottom = e.scrollHeight - e.scrollTop === e.clientHeight;
    if (bottom) { 
      setShowGoBotArrow(false);
     } else {
       setShowGoBotArrow(true);
     }
  }

  // useEffects

  // useEffect(async () => {
  //   if (chatScrollTop) {
  //     console.log(chatScrollTop, document.querySelector(`.chat-con-mid`).scrollHeight);
  //   if (chatScrollTop === document.querySelector(`.chat-con-mid`).scrollHeight) {
  //     setShowGoBotArrow(false);
  //   } else {
  //     setShowGoBotArrow(true);
  //   }}
  // }, [chatScrollTop]);

  useEffect(async () => {
    filterMsgsAva(chatroomMessages);
  }, [chatroomMessages]);

  useEffect(async () => {
    const abortController = new AbortController();
    if (activeChatroom)
      setChatState(true);
      await fetchChatroomUsersAndMessages(abortController.signal);
    return () => abortController.abort();
  }, [activeChatroom]);

  useEffect(async () => {
    // if (inputMessage.length > 0) {
    if (isTyping) {
      console.log("typing");
      if (ws && ws.readyState === 1)
        ws.send(
          JSON.stringify({
            type: "isTyping",
            detail: true,
            user: user,
            chatroom: activeChatroom._id,
          })
        );
    } else {
      // if (inputMessage.length > 1)
      if (ws && ws.readyState === 1)
        ws.send(
          JSON.stringify({
            type: "isTyping",
            detail: false,
            user: user,
            chatroom: activeChatroom._id,
          })
        );
    }
  }, [isTyping]);

  if (loading) {
    return <h4>loading ...</h4>;
  }

  return (
    <>
      <section
      onKeyPress={(e) => { 
        if (chatState) handleKeyPress(e)
      }}
        className={`flex height100 col3-chat-con ${
          chatState ? "chatstate" : "settingsstate"
        }`}
      >
        <section className="flex chat-con-top">
          <div className="flex top-userinfo">
            <StyledSection
              color={activeChatroom.theme}
              className="userinfo-avatar"
            ></StyledSection>
            <div className="top-userinfo-chatroom-name">
              {activeChatroom.name}
            </div>
          </div>
          <div className="flex top-settings">
            <div
              onClick={() => {
                setChatState(!chatState);
              }}
              className="userinfo-avatar"
            >
              <If condition={!chatState}>
                <i class="fas fa-times"></i>
              </If>
              <If condition={chatState}>
                <i class="fas fa-ellipsis-v"></i>
              </If>
            </div>
          </div>
        </section>

        <If condition={!chatState}>
          <section className="chat-con-mid">
            <HomeCol3ChatSettings
              ws={ws}
              user={user}
              room={activeChatroom}
              activeChatroom={activeChatroom}
              setActiveChatroom={setActiveChatroom}
              setChatroomUpdated={setChatroomUpdated}
              setChatState={setChatState}
              setHomeCol3State={setHomeCol3State}
            />
          </section>
        </If>

        <If condition={chatState}>
          
          <section className={`chat-con-mid`} onScroll={(e) => handleScroll(e.target)}>
          <If condition={showGoBotArrow}>
            <div
              onClick={() => {
                document.querySelector(`.chat-con-mid`).scrollTop =
                  document.querySelector(`.chat-con-mid`).scrollHeight;
              }}
              className="arr-con"
            >
              <i class="fas fa-arrow-down"></i>
            </div>
            </If>
            <If condition={chatroomMessages && chatroomMessages.length > 0}>
              {chatroomMessages.map((m, i) => {
                return (
                  <Message
                    m={m}
                    user={user}
                    chatroomUsers={chatroomUsers}
                    msgAva={msgAva}
                    ws={ws}
                    newReaction={newReaction}
                    setNewReaction={setNewReaction}
                    usersOnline={usersOnline}
                  />
                );
              })}
            </If>
            <If condition={membersTyping.length > 0}>
              {membersTyping.map((m, i) => {
                return (
                  <div className="flex istyping-con">
                    <div className="flex">
                      <StyledDiv
                        img={m.userAva}
                        className="istyping-avatar"
                      ></StyledDiv>
                      {m.userName}
                    </div>{" "}
                    <If condition={i === membersTyping.length - 1}>
                      <span> is typing...</span>
                    </If>
                  </div>
                );
              })}
            </If>
          </section>
          <section className="flex chat-con-bot">
            <div className="con-bot-con-message">
              <input
                placeholder="write message"
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  if (e.target.value.length > 0 && !isTyping) {
                    setIsTyping(true);
                  } else if (e.target.value.length < 1 && isTyping) {
                    setIsTyping(false);
                  }
                }}
              />
            </div>
            <button
             className="send-btn"
              type="button"
              // onKeyPress={(e) => console.log(e)}
              onClick={() => {
                if (inputMessage !== "") sendMessage();
              }}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </section>
        </If>
      </section>
    </>
  );
};

const Message = ({
  ws,
  m,
  user,
  chatroomUsers,
  msgAva,
  newReaction,
  usersOnline,
}) => {
  // states
  const [showMessageDetails, setShowMessageDetails] = useState(null);
  const [mesReactions, setMesReactions] = useState([]);
  const [showReactions, setShowReactions] = useState(false);

  // fetches
  const fetchPostMsgReaction = async (payload) => {
    let res = await post(`/protected/post-messagereaction`, payload);

    if (ws && ws.readyState === 1)
      ws.send(
        JSON.stringify({
          type: "reaction",
          detail: "create",
          reacter: payload.userId,
          reaction: payload.reaction,
          chatroom: payload.message.chatroom,

          messageId: payload.message._id,
          message: payload.message,
        })
      );
  };

  const fetchDeleteMsgReaction = async (payload) => {
    const abortController = new AbortController();
    let res = await get(
      `/protected/delete-messagereaction/${payload.message._id}/${payload.reactionId}`,
      abortController.signal
    );

    if (ws && ws.readyState === 1)
      ws.send(
        JSON.stringify({
          type: "reaction",
          detail: "delete",
          reactionId: payload.reactionId,
          chatroom: payload.message.chatroom,
          messageId: payload.message._id,
        })
      );
    return () => abortController.abort();
  };

  // useEffects
  useEffect(async () => {
    if (!newReaction) {
      setMesReactions(m.reactions);
    } else if (newReaction.messageId === m._id) {
      switch (newReaction.detail) {
        case "create":
          setMesReactions([
            ...mesReactions,
            {
              reacter: newReaction.reacter,
              reaction: newReaction.reaction,
            },
          ]);
          break;

        case "delete":
          setMesReactions(
            mesReactions.filter((r) => r._id !== newReaction.reactionId)
          );
          break;
      }
    }
  }, [newReaction]);

  return (
    <>
      <If condition={m.msgType === "userUpdate"}>
        <div className="flex userupdate-msg">
          <StyledDiv
            img={m.sender.avatar}
            className="userupdate-msg-ava"
          ></StyledDiv>
          <i>{m.text}</i>
        </div>
      </If>

      <If condition={m.msgType === "message"}>
        <div
          className={`flex ${
            m.sender._id === user._id ? "message-right" : "message-left"
          } ${showReactions ? "active" : ""} ${
            !msgAva.includes(m) ? "noava" : ""
          } ${mesReactions.length > 0 ? "reac" : ""}`}
        >
          <section className={`flex reactions-con`}>
            <If condition={m.sender._id === user._id}>
              <If
                condition={
                  !showReactions &&
                  !mesReactions.some((r) => r.reacter === user._id)
                }
              >
                <div
                  className="reactions-con-showadd"
                  onClick={() => setShowReactions(true)}
                >
                  <i class="fas fa-plus"></i>
                </div>
              </If>
              <If condition={showReactions}>
                <Reactions
                  fetchPostMsgReaction={fetchPostMsgReaction}
                  m={m}
                  user={user}
                  showReactions={showReactions}
                  setShowReactions={setShowReactions}
                />
              </If>
              <div className="flex reactions-added-con">
                {mesReactions.map((r) => {
                  console.log(r);
                  return (
                    <>
                      <i className={r.reaction}></i>
                      <If condition={r.reacter === user._id}>
                        <span
                          onClick={() => {
                            fetchDeleteMsgReaction({
                              message: m,
                              reactionId: r._id,
                            });
                          }}
                        ></span>
                      </If>
                    </>
                  );
                })}
              </div>
            </If>
            <div
              className={`flex message-wrapper`}
              onClick={() =>
                showMessageDetails
                  ? showMessageDetails === m
                    ? setShowMessageDetails(null)
                    : setShowMessageDetails(m)
                  : setShowMessageDetails(m)
              }
            >
              <If condition={m.sender._id !== user._id && msgAva.includes(m)}>
                <StyledDiv img={m.sender.avatar} className="message-avatar">
                  <div className="onlinestatus-con">
                    <StyledSpan
                      color={
                        usersOnline.filter((user) => user._id === m.sender._id)
                          .length > 0
                          ? "#A2DC68"
                          : "#FF997D"
                      }
                      className="user-con-onlinestatus"
                    ></StyledSpan>
                  </div>
                </StyledDiv>
              </If>

              <div className="message-text">{m.text}</div>
              <If condition={m.sender._id === user._id && msgAva.includes(m)}>
                <StyledDiv img={m.sender.avatar} className="message-avatar">
                  <div className="onlinestatus-con">
                    <StyledSpan
                      color={
                        usersOnline.filter((user) => user._id === m.sender._id)
                          .length > 0
                          ? "#A2DC68"
                          : "#FF997D"
                      }
                      className="user-con-onlinestatus"
                    ></StyledSpan>
                  </div>
                </StyledDiv>
              </If>
            </div>
            <If condition={m.sender._id !== user._id}>
              <If
                condition={
                  !showReactions &&
                  !mesReactions.some((r) => r.reacter === user._id)
                }
              >
                <div
                  className="reactions-con-showadd"
                  onClick={() => setShowReactions(true)}
                >
                  <i class="fas fa-plus"></i>
                </div>
              </If>
              <If condition={showReactions}>
                <Reactions
                  fetchPostMsgReaction={fetchPostMsgReaction}
                  m={m}
                  user={user}
                  showReactions={showReactions}
                  setShowReactions={setShowReactions}
                />
              </If>
              <div className="flex reactions-added-con">
                {mesReactions.map((r) => {
                  console.log(r);
                  return (
                    <>
                      <i className={r.reaction}></i>
                      <If condition={r.reacter === user._id}>
                        <span
                          onClick={() => {
                            fetchDeleteMsgReaction({
                              message: m,
                              reactionId: r._id,
                            });
                          }}
                        ></span>
                      </If>
                    </>
                  );
                })}
              </div>
            </If>
          </section>
          <If condition={showMessageDetails === m}>
            <div className="msg-details-name">
              {/* Sent by: {chatroomUsers.filter((u) => u._id === m.sender)[0].name} */}
              Sent by: {m.sender.name}
            </div>
            <div className="msg-details-time">{m.time}</div>
          </If>
        </div>
      </If>
    </>
  );
};

const Reactions = ({
  fetchPostMsgReaction,
  m,
  user,
  showReactions,
  setShowReactions,
}) => {
  return (
    <div className={`flex reactions-add-con`}>
      <div
        onClick={() => {
          fetchPostMsgReaction({
            reaction: "fas fa-thumbs-up",
            message: m,
            userId: user._id,
          });
          setShowReactions(false);
        }}
      >
        {/* thumbsup */}
        <i className="fas fa-thumbs-up"></i>
      </div>
      <div
        onClick={() => {
          fetchPostMsgReaction({
            reaction: "far fa-grin",
            message: m,
            userId: user._id,
          });
          setShowReactions(false);
        }}
      >
        {/* happy */}
        <i className="far fa-grin"></i>
      </div>
      <div
        onClick={() => {
          fetchPostMsgReaction({
            reaction: "far fa-grin-squint-tears",
            message: m,
            userId: user._id,
          });
          setShowReactions(false);
        }}
      >
        {/* laugh */}
        <i className="far fa-grin-squint-tears"></i>
      </div>
      <div
        onClick={() => {
          fetchPostMsgReaction({
            reaction: "far fa-angry",
            message: m,
            userId: user._id,
          });
          setShowReactions(false);
        }}
      >
        {/* angry */}
        <i className="far fa-angry"></i>
      </div>
      <div
        onClick={() => {
          fetchPostMsgReaction({
            reaction: "far fa-frown",
            message: m,
            userId: user._id,
          });
          setShowReactions(false);
        }}
      >
        {/* sad */}
        <i className="far fa-frown"></i>
      </div>
      <div
        onClick={() => {
          fetchPostMsgReaction({
            reaction: "fas fa-thumbs-down",
            message: m,
            userId: user._id,
          });
          setShowReactions(false);
        }}
      >
        {/* thumbsdown */}
        <i className="fas fa-thumbs-down"></i>
      </div>

      <div onClick={() => setShowReactions(false)}>
        <i className="fas fa-times"></i>
      </div>
    </div>
  );
};
