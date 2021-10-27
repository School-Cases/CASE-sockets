import { useState, useEffect } from "react";

import { If } from "../../../../utils/If";
import { post, get } from "../../../../utils/http";
import { getDateAndTime } from "../../../../utils/getDate&Time";

import styled from "styled-components";
const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;

export const Chat = ({
  activeChatroom,
  user,
  // fetchLastMsg,
  // setFetchLastMsg,
  ws,
}) => {
  const [Message, setmessage] = useState(null);
  const [Messages, setmessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [roomMembers, setRoomMembers] = useState([]);
  const [notRoomMembers, setNotRoomMembers] = useState([]);
  const [roomAdmins, setRoomAdmins] = useState([]);
  const [msgAva, setMsgAva] = useState([]);
  const [fetchMsgs, setFetchMsgs] = useState(false);

  const fetchAllUsers = async (signal, activeRoom) => {
    let res = await get(`/protected/get-all-users`, signal);
    setRoomMembers(
      res.data
        .filter((u) => activeRoom.members.includes(u._id))
        .sort((a, b) => {
          return (
            activeRoom.admins.includes(b._id) -
            activeRoom.admins.includes(a._id)
          );
        })
    );
    setNotRoomMembers(
      res.data.filter((u) => !activeRoom.members.includes(u._id))
    );
    setRoomAdmins(res.data.filter((u) => activeRoom.admins.includes(u._id)));
    setLoading(false);
  };

  const fetchMessages = async (signal) => {
    let res = await get(
      `/protected/get-chatroom-messages/` + activeChatroom._id,
      signal
    );
    await fetchAllUsers(signal, activeChatroom);
    filterMsgsAva(res.data);
    setmessages(res.data);
  };

  const msg = () => {
    setmessage({
      type: "message",
      sender: user._id,
      chatroom: activeChatroom._id,
      text: inputMessage,
      time: getDateAndTime(),
    });
  };

  const filterMsgsAva = (msgs) => {
    let arr2 = [];
    for (let i = 0; i < msgs.length; i++) {
      if (msgs[i + 1]) {
        if (msgs[i].sender !== msgs[i + 1].sender) {
          arr2.push(msgs[i]);
        }
      } else {
        arr2.push(msgs[i]);
      }
    }
    setMsgAva(arr2);
  };

  useEffect(async () => {
    if (ws) {
      ws.onmessage = async (e) => {
        let theMessage = JSON.parse(e.data);
        let resMessage;
        if (theMessage.type === "message") {
          if (user._id === theMessage.sender) {
            resMessage = await post(`/protected/create-message`, theMessage);
          }
          if (theMessage.chatroom === activeChatroom._id) {
            setmessages([...Messages, theMessage]);
            let msgs = Messages;
            msgs.push(theMessage);
            filterMsgsAva(msgs);
            // setFetchLastMsg(!fetchLastMsg);
            document.querySelector(`.chat-con-mid`).scrollTop =
              document.querySelector(`.chat-con-mid`).scrollHeight;
          }
        }
      };
    }
  }, [ws.onmessage]);

  useEffect(() => {
    if (Message && ws && ws.readyState === 1) {
      ws.send(JSON.stringify(Message));
      // ws.send(
      //   JSON.stringify({
      //     type: "roomsUpdate",
      //   })
      // );
    }
  }, [Message]);

  useEffect(async () => {
    const abortController = new AbortController();
    if (activeChatroom !== null) await fetchMessages(abortController.signal);
    return () => abortController.abort();
  }, [activeChatroom]);

  if (loading) {
    <h4>loading ...</h4>;
  }

  return (
    <>
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
        <If condition={Messages && Messages.length !== 0}>
          {Messages.map((m, i) => {
            return (
              <div
                className={`${
                  m.sender === user._id ? "message-right" : "message-left"
                }`}
              >
                <div className="flex message-wrapper">
                  <If condition={m.sender !== user._id && msgAva.includes(m)}>
                    <StyledDiv
                      img={
                        roomMembers.filter((me) => me._id === m.sender)[0]
                          .avatar
                      }
                      className="message-avatar"
                    ></StyledDiv>
                  </If>
                  <div className="message-text">{m.text}</div>
                  <If condition={m.sender === user._id && msgAva.includes(m)}>
                    <StyledDiv
                      img={
                        roomMembers.filter((me) => me._id === m.sender)[0]
                          .avatar
                      }
                      className="message-avatar"
                    ></StyledDiv>
                  </If>
                </div>
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
        <button type="button" onClick={() => msg()}>
          send
        </button>
      </section>
    </>
  );
};
