import { If } from "../../../../utils/If";
import { ChatSettingsAcc } from "./ChatSettingsAcc";

import { post, get } from "../../../../utils/http";

import { useEffect } from "react";
import { useState, useContext } from "react";

import { getDateAndTime } from "../../../../utils/getDate&Time";

import styled from "styled-components";

const StyledDiv = styled("div")`
  background-image: url(../avatars/${(props) => props.img});
`;

export const Chat = ({
  activeChatroom,
  setActiveChatroom,
  user,
  fetchLastMsg,
  setFetchLastMsg,
  send,
  // message,
  // messages,
  // setMessage,
  // setMessages,
  ws,
}) => {
  console.log(ws);
  // const [ws, setWs] = useState(
  //   new WebSocket(
  //     "ws://localhost:5002"
  //     // "ws://localhost:5002" + "/protected/get-chatroom/" + activeChatroom._id
  //   )
  // );

  // const ws = new WebSocket(
  //   "ws://localhost:5002"
  //   // "ws://localhost:5002" + "/protected/get-chatroom/" + activeChatroom._id
  // );
  const [Message, setmessage] = useState(null);
  const [Messages, setmessages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState("");

  const [roomMembers, setRoomMembers] = useState([]);
  const [notRoomMembers, setNotRoomMembers] = useState([]);
  const [roomAdmins, setRoomAdmins] = useState([]);
  const [msgAva, setMsgAva] = useState([]);

  const [fetchMsgs, setFetchMsgs] = useState(false);

  // const send = () => {
  //   // console.log('send');
  //   if (!message) return;

  //   ws.send(
  //     JSON.stringify({
  //       type: "message",
  //       sender: user._id,
  //       chatroom: activeChatroom._id,
  //       text: message,
  //       time: getDateAndTime(),
  //     })
  //   );

  //   // return setMessage("");
  //   // if (messages.length !== 0) {
  //   //   setMessages([...messages, message]);
  //   // }
  //   console.log(message);
  // };

  const msg = async () => {
    console.log("send");

    // if (ws)

    // let theMessage = {
    //   type: "message",
    //   sender: user._id,
    //   chatroom: activeChatroom._id,
    //   text: inputMessage,
    //   time: getDateAndTime(),
    // };
    // await post(`/protected/create-message`, theMessage);

    // ws.send(JSON.stringify(theMessage));
    setmessage({
      type: "message",
      sender: user._id,
      chatroom: activeChatroom._id,
      text: inputMessage,
      time: getDateAndTime(),
    });

    // return setMessage("");
    // if (messages.length !== 0) {
    //   setMessages([...messages, message]);
    // }
  };

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

  const filterMsgsAva = (msgs) => {
    // let arr = res.data;
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
    // return arr2;
    setMsgAva(arr2);
  };

  const fetchMessages = async (signal) => {
    let res = await get(
      `/protected/get-chatroom-messages/` + activeChatroom._id,
      signal
    );

    // let arr = res.data;
    // let arr2 = [];

    // for (let i = 0; i < arr.length; i++) {
    //   if (arr[i + 1]) {
    //     if (arr[i].sender !== arr[i + 1].sender) {
    //       arr2.push(arr[i]);
    //     }
    //   } else {
    //     arr2.push(arr[i]);
    //   }
    // }

    await fetchAllUsers(signal, activeChatroom);
    filterMsgsAva(res.data);
    setmessages(res.data);
  };

  // useEffect(() => {
  //   if (ws) {
  //     ws.onmessage = async (e) => {
  //       // console.log("feasdasdasd");
  //       // setMessage(JSON.parse(e.data));
  //       console.log(e.data);

  //       let theMessage = JSON.parse(e.data);
  //       console.log(theMessage);
  //       let resMessage;
  //       if (theMessage.type === "message") {
  //         if (user._id === theMessage.sender) {
  //           console.log("posting");
  //           resMessage = await post(`/protected/create-message`, theMessage);
  //           console.log(resMessage.data);
  //         }

  //         if (theMessage.chatroom === activeChatroom._id) {
  //           console.log("ta emot");
  //           // const abortController = new AbortController();
  //           // let resMessage = await get(
  //           //   `/protected/get-message/` + ,
  //           //   abortController.signal
  //           // );
  //           console.log(resMessage.data);
  //           // console.log(Messages);
  //           setmessages([...Messages, resMessage.data]);
  //           // console.log("fetching all mesgs");
  //           // setFetchMsgs(!fetchMsgs);
  //           // setFetchLastMsg(!fetchLastMsg);
  //         }
  //       }
  //     };
  //   }
  // }, [ws.onmessage]);

  // useEffect(() => {
  //   filterMsgsAva(Messages);
  // }, [Messages]);

  useEffect(() => {
    // ws.onopen = () => {
    //   console.log("WebSocket Connected");
    // };
    console.log(Messages);

    if (ws) {
      ws.onmessage = async (e) => {
        // console.log("feasdasdasd");
        // setMessage(JSON.parse(e.data));
        console.log(e.data);

        let theMessage = JSON.parse(e.data);
        // console.log(theMessage);
        let resMessage;
        if (user._id === theMessage.sender) {
          resMessage = await post(`/protected/create-message`, theMessage);
        }
        console.log(resMessage);

        if (theMessage.chatroom === activeChatroom._id) {
          // console.log(Messages);
          // let msgs = Messages;
          // msgs.push(theMessage);
          // console.log(msgs);
          // filterMsgsAva(msgs);
          setmessages([...Messages, theMessage]);
          // console.log(Messages);
          let msgs = Messages;
          msgs.push(theMessage);
          console.log(msgs);
          filterMsgsAva(msgs);
          // filterMsgsAva(msgs);
          console.log("fetching all mesgs");
          // setFetchLastMsg(!fetchLastMsg);
        }
      };
    }
  }, [ws.onmessage]);

  useEffect(() => {
    if (Message && ws && ws.readyState === 1) {
      console.log("ok");
      ws.send(JSON.stringify(Message));
    }
  }, [Message]);

  useEffect(async () => {
    const abortController = new AbortController();
    if (activeChatroom !== null) await fetchMessages(abortController.signal);
    return () => abortController.abort();
  }, [activeChatroom, fetchMsgs]);

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
          {/* <ChatSettingsAcc /> */}
        </div>
      </section>

      <section className="height100 chat-con-mid">
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
