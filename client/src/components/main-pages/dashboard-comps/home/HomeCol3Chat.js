import { useEffect, useState } from "react";

import styled from "styled-components";

import { api_address, get, post } from "../../../../utils/http";
import { If } from "../../../../utils/If";
import { getDateAndTime } from "../../../../utils/getDate&Time";
const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;
export const HomeCol3Chat = ({
  ws,
  user,
  activeChatroom,
  chatroomMessages,
  setChatroomMessages,
  messageReaction,
  setMessageReaction,
}) => {
  // states
  const [loading, setLoading] = useState(true);
  const [chatroomUsers, setChatroomUsers] = useState([]);
  // const [chatroomMessages, setChatroomMessages] = useState([]);
  const [msgAva, setMsgAva] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  // const [showMessageDetails, setShowMessageDetails] = useState(null);

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
          sender: user._id,
          chatroom: activeChatroom._id,
          reactions: [],
          text: inputMessage,
          time: getDateAndTime(),
        })
      );
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

  // useEffect(async () => {
  //   if (ws) {
  //     ws.onmessage = async (e) => {
  //       let data = JSON.parse(e.data);
  //       console.log(data);
  //       if (data.type === "message") {
  //         if (data.chatroom === activeChatroom._id) {
  //           setChatroomMessages([...chatroomMessages, data]);
  //           let msgs = chatroomMessages;
  //           msgs.push(data);
  //           filterMsgsAva(msgs);
  //           document.querySelector(`.chat-con-mid`).scrollTop =
  //             document.querySelector(`.chat-con-mid`).scrollHeight;
  //         }
  //         if (
  //           userChatrooms.filter((room) => room._id === data.chatroom).length >
  //           0
  //         ) {
  //           console.log("chat, setLast");
  //           setChatroomLastMessage({ chatroom: data.chatroom });
  //         }
  //       }
  //     };
  //   }
  // }, [ws.onmessage]);

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
                  // <div
                  //   className={`flex ${
                  //     m.sender === user._id ? "message-right" : "message-left"
                  //   }`}
                  // >
                  //   <div
                  //     className="flex message-wrapper"
                  //     onClick={() =>
                  //       showMessageDetails
                  //         ? showMessageDetails === m
                  //           ? setShowMessageDetails(null)
                  //           : setShowMessageDetails(m)
                  //         : setShowMessageDetails(m)
                  //     }
                  //   >
                  //     <If
                  //       condition={m.sender !== user._id && msgAva.includes(m)}
                  //     >
                  //       <StyledDiv
                  //         img={
                  //           chatroomUsers.filter((u) => u._id === m.sender)[0]
                  //             .avatar
                  //         }
                  //         className="message-avatar"
                  //       ></StyledDiv>
                  //     </If>
                  //     <div className="message-text">{m.text}</div>
                  //     <If
                  //       condition={m.sender === user._id && msgAva.includes(m)}
                  //     >
                  //       <StyledDiv
                  //         img={
                  //           chatroomUsers.filter((u) => u._id === m.sender)[0]
                  //             .avatar
                  //         }
                  //         className="message-avatar"
                  //       ></StyledDiv>
                  //     </If>
                  //   </div>
                  //   <If condition={showMessageDetails === m}>
                  //     <div className="flex">
                  //       <div
                  //         onClick={(e) => {
                  //           fetchPostMsgReaction({
                  //             reaction: e.target.value,
                  //             messageId: m._id,
                  //             userId: user._id,
                  //           });
                  //         }}
                  //       >
                  //         0
                  //       </div>
                  //       <div>1</div>
                  //       <div>2</div>
                  //       <div>3</div>
                  //     </div>
                  //     <div>
                  //       Sent by:{" "}
                  //       {
                  //         chatroomUsers.filter((u) => u._id === m.sender)[0]
                  //           .name
                  //       }
                  //     </div>
                  //     <div>{m.time}</div>
                  //   </If>
                  // </div>
                  <Message
                    m={m}
                    user={user}
                    chatroomUsers={chatroomUsers}
                    msgAva={msgAva}
                    ws={ws}
                    messageReaction={messageReaction}
                    setMessageReaction={setMessageReaction}
                  />
                );
              })}
            </If>
          </section>
          <section className="flex chat-con-bot">
            <div className="con-bot-con-message">
              <input
                placeholder="write message"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
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
  messageReaction,
  setMessageReaction,
}) => {
  console.log(m);
  console.log(messageReaction);
  const [showMessageDetails, setShowMessageDetails] = useState(null);
  const [mesReactions, setMesReactions] = useState([]);

  const fetchPostMsgReaction = async (payload) => {
    let res = await post(`/protected/post-messagereaction`, payload);
    console.log(res);

    if (ws && ws.readyState === 1)
      ws.send(
        JSON.stringify({
          type: "message",
          detail: "reaction",
          reacter: payload.userId,
          reaction: payload.reaction,
          chatroom: payload.message.chatroom,
          message: payload.message,
        })
      );
  };

  useEffect(async () => {
    if (!messageReaction) {
      setMesReactions(m.reactions);
    } else if (messageReaction.message._id === m._id) {
      setMesReactions([
        ...m.reactions,
        {
          reacter: messageReaction.reacter,
          reaction: messageReaction.reaction,
        },
      ]);
    }
  }, [messageReaction]);

  return (
    <div
      className={`flex ${
        m.sender === user._id ? "message-right" : "message-left"
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
          {console.log(mesReactions)}
          {mesReactions.map((r) => {
            return <div>{r.reaction}</div>;
          })}
        </div>
        <If condition={m.sender !== user._id && msgAva.includes(m)}>
          <StyledDiv
            img={chatroomUsers.filter((u) => u._id === m.sender)[0].avatar}
            className="message-avatar"
          ></StyledDiv>
        </If>
        <div className="message-text">{m.text}</div>
        <If condition={m.sender === user._id && msgAva.includes(m)}>
          <StyledDiv
            img={chatroomUsers.filter((u) => u._id === m.sender)[0].avatar}
            className="message-avatar"
          ></StyledDiv>
        </If>
      </div>
      <If condition={showMessageDetails === m}>
        <div className="flex">
          <div
            onClick={(e) => {
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
            onClick={(e) => {
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
            onClick={(e) => {
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
            onClick={(e) => {
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
          Sent by: {chatroomUsers.filter((u) => u._id === m.sender)[0].name}
        </div>
        <div>{m.time}</div>
      </If>
    </div>
  );
};
