import { useEffect, useState } from "react";

import { get, post } from "../../../../utils/http";
import { If } from "../../../../utils/If";
import { getDateAndTime } from "../../../../utils/getDate&Time";

import styled from "styled-components";
const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;

export const HomeCol3Chat = ({
  ws,
  user,
  activeChatroom,
  chatroomMessages,
  setChatroomMessages,
  newReaction,
  setNewReaction,
  membersTyping,
  usersOnline,
}) => {
  // states
  const [loading, setLoading] = useState(true);

  const [chatroomUsers, setChatroomUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [msgAva, setMsgAva] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

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
        if (msgs[i].sender !== msgs[i + 1].sender) {
          arr.push(msgs[i]);
        }
      } else {
        arr.push(msgs[i]);
      }
    }
    setMsgAva(arr);
  };

  // useEffects
  useEffect(async () => {
    filterMsgsAva(chatroomMessages);
  }, [chatroomMessages]);

  useEffect(async () => {
    const abortController = new AbortController();
    if (activeChatroom)
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
      {activeChatroom ? (
        <section className="flex height100 col3-chat-con">
          <section className="flex chat-con-top">
            <div className="flex top-userinfo">
              <div className="userinfo-avatar">ava</div>
              <div className="top-userinfo-chatroom-name">
                {activeChatroom.name}
              </div>
            </div>
            <div className="flex top-settings">
              <div className="userinfo-avatar">...</div>
            </div>
          </section>

          <div
            onClick={() => {
              document.querySelector(`.chat-con-mid`).scrollTop =
                document.querySelector(`.chat-con-mid`).scrollHeight;
            }}
          >
            go bot
          </div>
          <section className={`chat-con-mid`}>
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
                    </div>
                    <If condition={i === membersTyping.length - 1}>
                      <span>is typing</span>
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
            <button type="button" onClick={() => sendMessage()}>
              send
            </button>
          </section>
        </section>
      ) : (
        <h2>no active</h2>
      )}
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
    <div
      className={`flex ${
        m.sender._id === user._id ? "message-right" : "message-left"
      }`}
    >
      <div
        className="flex message-wrapper"
        onClick={() =>
          showMessageDetails
            ? showMessageDetails === m
              ? setShowMessageDetails(null)
              : setShowMessageDetails(m)
            : setShowMessageDetails(m)
        }
      >
        <div>
          {mesReactions.map((r) => {
            return (
              <div>
                {r.reaction}
                <If condition={r.reacter === user._id}>
                  <span
                    onClick={() => {
                      fetchDeleteMsgReaction({
                        message: m,
                        reactionId: r._id,
                      });
                    }}
                  >
                    X
                  </span>
                </If>
              </div>
            );
          })}
        </div>
        <If condition={m.sender._id !== user._id && msgAva.includes(m)}>
          <StyledDiv
            img={m.sender.avatar}
            className="message-avatar"
          ></StyledDiv>
          {/* online */}
          <If
            condition={
              usersOnline.filter((user) => user._id === m.sender._id).length > 0
            }
          >
            <span>:D</span>
          </If>
          {/* ------- */}
        </If>
        <div className="message-text">{m.text}</div>
        <If condition={m.sender._id === user._id && msgAva.includes(m)}>
          <StyledDiv
            img={m.sender.avatar}
            className="message-avatar"
          ></StyledDiv>
          {/* online */}
          <If
            condition={
              usersOnline.filter((user) => user._id === m.sender._id).length > 0
            }
          >
            <span>:D</span>
          </If>
          {/* ------- */}
        </If>
      </div>
      <If condition={showMessageDetails === m}>
        <div className="flex">
          <div
            onClick={() => {
              fetchPostMsgReaction({
                reaction: 0,
                message: m,
                userId: user._id,
              });
            }}
          >
            0
          </div>
          <div
            onClick={() => {
              fetchPostMsgReaction({
                reaction: 1,
                message: m,
                userId: user._id,
              });
            }}
          >
            1
          </div>
          <div
            onClick={() => {
              fetchPostMsgReaction({
                reaction: 2,
                message: m,
                userId: user._id,
              });
            }}
          >
            2
          </div>
          <div
            onClick={() => {
              fetchPostMsgReaction({
                reaction: 3,
                message: m,
                userId: user._id,
              });
            }}
          >
            3
          </div>
        </div>
        <div>
          {/* Sent by: {chatroomUsers.filter((u) => u._id === m.sender)[0].name} */}
          Sent by: {m.sender.name}
        </div>
        <div>{m.time}</div>
      </If>
    </div>
  );
};
