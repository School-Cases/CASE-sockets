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
}) => {
  // states
  const [loading, setLoading] = useState(true);
  const [chatroomUsers, setChatroomUsers] = useState([]);
  // const [chatroomMessages, setChatroomMessages] = useState([]);
  const [msgAva, setMsgAva] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showMessageDetails, setShowMessageDetails] = useState(null);

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
          sender: user._id,
          chatroom: activeChatroom._id,
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
                      <If
                        condition={m.sender !== user._id && msgAva.includes(m)}
                      >
                        <StyledDiv
                          img={
                            chatroomUsers.filter((u) => u._id === m.sender)[0]
                              .avatar
                          }
                          className="message-avatar"
                        ></StyledDiv>
                      </If>
                      <div className="message-text">{m.text}</div>
                      <If
                        condition={m.sender === user._id && msgAva.includes(m)}
                      >
                        <StyledDiv
                          img={
                            chatroomUsers.filter((u) => u._id === m.sender)[0]
                              .avatar
                          }
                          className="message-avatar"
                        ></StyledDiv>
                      </If>
                    </div>
                    <If condition={showMessageDetails === m}>
                      <div>
                        Sent by:{" "}
                        {
                          chatroomUsers.filter((u) => u._id === m.sender)[0]
                            .name
                        }
                      </div>
                      <div>{m.time}</div>
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
