// ws: 1. new message. update if userChatrooms includes user.
// ws: 2. member leaves room. update if activechatroom === leaved room.
// ws: 3. user joins room. update if activechatroom === joined room.

import { useEffect, useState } from "react";

import { Col } from "react-bootstrap";

import { HomeCol2 } from "./home/HomeCol2";
import { HomeCol3Chat } from "./home/HomeCol3Chat";
import { HomeCol3CreateChatroom } from "./home/HomeCol3CreateChatroom";

import { breakpoints } from "../../../utils/breakpoints";
import { If } from "../../../utils/If";
import { getDateAndTime } from "../../../utils/getDate&Time";

export const NavHome = ({
  ws,
  user,
  userChatrooms,
  notUserChatrooms,
  usersOnline,
  setUsersOnline,
  setChatroomUpdated,
}) => {
  // states
  const [W, setW] = useState(window.innerWidth);

  const [homeCol3State, setHomeCol3State] = useState("createChatroom");
  const [chatroomLastMessage, setChatroomLastMessage] = useState(null);
  const [chatroomUnreadMsgs, setChatroomUnreadMsgs] = useState(null);
  const [activeChatroom, setActiveChatroom] = useState(false);
  const [chatroomMessages, setChatroomMessages] = useState([]);
  const [newReaction, setNewReaction] = useState(null);
  const [membersTyping, setMembersTyping] = useState([]);

  const [mobileCol2Chatrooms, setMobileCol2Chatrooms] = useState(true);

  //   useEffects
  useEffect(async () => {
    if (ws) {
      ws.onmessage = async (e) => {
        let data = JSON.parse(e.data);
        console.log(data);

        switch (data.type) {
          case "usersOnline":
            setUsersOnline(data.users);
            break;

          case "isTyping":
            if (data.chatroom === activeChatroom._id)
              if (data.user._id !== user._id)
                if (data.detail) {
                  setMembersTyping([
                    ...membersTyping,
                    {
                      userName: data.user.name,
                      userAva: data.user.avatar,
                      userId: data.user._id,
                    },
                  ]);
                  document.querySelector(`.chat-con-mid`).scrollTop =
                    document.querySelector(`.chat-con-mid`).scrollHeight;
                } else {
                  setMembersTyping(
                    membersTyping.filter((m) => m.userId !== data.user._id)
                  );
                }
            break;

          case "reaction":
            if (data.chatroom === activeChatroom._id) {
              setNewReaction(data);
            }
            break;

          case "message":
            if (activeChatroom && data.chatroom === activeChatroom._id) {
              if (data.detail === "userLeft" && user._id === data.sender._id) {
                return;
              } else {
                setChatroomMessages([...chatroomMessages, data]);
                document.querySelector(`.chat-con-mid`).scrollTop =
                  document.querySelector(`.chat-con-mid`).scrollHeight;
              }
            }
            if (
              userChatrooms.filter((room) => room._id === data.chatroom)
                .length > 0
            ) {
              if (data.chatroom !== activeChatroom._id) {
                setChatroomUnreadMsgs({ chatroom: data.chatroom });
              }
              setChatroomLastMessage({ chatroom: data.chatroom });
            }
            break;

          case "chatroomUpdate":
            let chatroomAffected = userChatrooms.filter(
              (ch) => ch._id === data.chatroomId
            );
            if (chatroomAffected[0]) {
              switch (data.detail) {
                case "userJoined":
                  ws.send(
                    JSON.stringify({
                      type: "message",
                      detail: "userJoined",
                      sender: data.user,
                      chatroom: data.chatroomId,
                      reactions: [],
                      text: `${data.user.name} has joined the chat!`,
                      time: getDateAndTime(),
                    })
                  );
                  break;

                case "userLeft":
                  if (data.user._id !== user._id) {
                    ws.send(
                      JSON.stringify({
                        type: "message",
                        detail: "userLeft",
                        sender: data.user,
                        chatroom: data.chatroomId,
                        reactions: [],
                        text: `${data.user.name} has left the chat!`,
                        time: getDateAndTime(),
                      })
                    );
                  }
                  break;
              }
            }
            break;

          case "chatroomCreate":
            setChatroomUpdated(true);
            break;

          case "chatroomDelete":
            setChatroomUpdated(true);

            if (data.chatroomId === activeChatroom._id) {
              setHomeCol3State("createChatroom");
              setActiveChatroom(null);
            }
            break;
        }
      };
    }
  }, [ws.onmessage]);

  useEffect(() => {
    let changeW = window.addEventListener("resize", () =>
      setW(window.innerWidth)
    );
    return window.removeEventListener("resize", changeW);
  }, [W]);

  return (
    <>
      <Col
        lg={{ span: 4, order: 2 }}
        md={{ span: 4, order: 2 }}
        xs={{ span: 12, order: 2 }}
        className="dashboard-con-col2"
      >
        <If
          condition={
            (W < breakpoints.medium && mobileCol2Chatrooms) ||
            W > breakpoints.medium
          }
        >
          <HomeCol2
            ws={ws}
            user={user}
            userChatrooms={userChatrooms}
            notUserChatrooms={notUserChatrooms}
            activeChatroom={activeChatroom}
            setActiveChatroom={setActiveChatroom}
            homeCol3State={homeCol3State}
            setHomeCol3State={setHomeCol3State}
            chatroomLastMessage={chatroomLastMessage}
            setChatroomLastMessage={setChatroomLastMessage}
            chatroomUnreadMsgs={chatroomUnreadMsgs}
            setChatroomUnreadMsgs={setChatroomUnreadMsgs}
            setChatroomUpdated={setChatroomUpdated}
            usersOnline={usersOnline}
            setMobileCol2Chatrooms={setMobileCol2Chatrooms}
          />
        </If>

        <If condition={W < breakpoints.medium && !mobileCol2Chatrooms}>
          <If condition={homeCol3State === "chat"}>
            <HomeCol3Chat
              ws={ws}
              user={user}
              activeChatroom={activeChatroom}
              setActiveChatroom={setActiveChatroom}
              chatroomMessages={chatroomMessages}
              setChatroomMessages={setChatroomMessages}
              newReaction={newReaction}
              setNewReaction={setNewReaction}
              membersTyping={membersTyping}
              usersOnline={usersOnline}
              setChatroomUpdated={setChatroomUpdated}
              setHomeCol3State={setHomeCol3State}
            />
          </If>
          <If condition={homeCol3State === "createChatroom"}>
            <HomeCol3CreateChatroom
              ws={ws}
              user={user}
              homeCol3State={homeCol3State}
            />
          </If>
        </If>
      </Col>

      <If condition={W > breakpoints.medium}>
        <Col
          lg={{ span: 6, order: 3 }}
          md={{ span: 6, order: 3 }}
          xs={{ span: 12, order: 3 }}
          className="dashboard-con-col3"
        >
          <If condition={homeCol3State === "chat"}>
            <HomeCol3Chat
              ws={ws}
              user={user}
              activeChatroom={activeChatroom}
              setActiveChatroom={setActiveChatroom}
              chatroomMessages={chatroomMessages}
              setChatroomMessages={setChatroomMessages}
              newReaction={newReaction}
              setNewReaction={setNewReaction}
              membersTyping={membersTyping}
              usersOnline={usersOnline}
              setChatroomUpdated={setChatroomUpdated}
              setHomeCol3State={setHomeCol3State}
            />
          </If>
          <If condition={homeCol3State === "createChatroom"}>
            <HomeCol3CreateChatroom
              ws={ws}
              user={user}
              homeCol3State={homeCol3State}
              setChatroomUpdated={setChatroomUpdated}
            />
          </If>
        </Col>
      </If>
    </>
  );
};
