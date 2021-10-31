// ws: 1. new message. update if userChatrooms includes user.
// ws: 2. member leaves room. update if activechatroom === leaved room.

import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";

import { HomeCol2 } from "./home/HomeCol2";
import { HomeCol3Chat } from "./home/HomeCol3Chat";
import { HomeCol3CreateChatroom } from "./home/HomeCol3CreateChatroom";

import { If } from "../../../utils/If";
import { breakpoints } from "../../../utils/breakpoints";

export const NavHome = ({ ws, user, userChatrooms, notUserChatrooms }) => {
  // states
  const [W, setW] = useState(window.innerWidth);
  const [activeChatroom, setActiveChatroom] = useState(false);
  const [homeCol3State, setHomeCol3State] = useState("createChatroom");
  //   const [chatroomLastMessage, setChatroomLastMessage] = useState(null);

  //   useEffects
  useEffect(async () => {
    if (ws) {
      ws.onmessage = async (e) => {
        let data = JSON.parse(e.data);
        if (
          data.type === "message" &&
          userChatrooms.filter((room) => room._id === data.chatroom).length < 0
        ) {
          ws.send(
            JSON.stringify({
              type: "message",
              detail: "updateLastMessage",
            })
          );
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
        lg={{ span: 5, order: 2 }}
        md={{ span: 5, order: 2 }}
        xs={{ span: 12, order: 2 }}
        className="dashboard-con-col2"
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
        />
      </Col>
      <If condition={W > breakpoints.medium}>
        <Col
          lg={{ span: 5, order: 3 }}
          md={{ span: 5, order: 3 }}
          xs={{ span: 12, order: 3 }}
          className="dashboard-con-col3"
        >
          <If condition={homeCol3State === "chat"}>
            <HomeCol3Chat
              ws={ws}
              user={user}
              activeChatroom={activeChatroom}
              homeCol3State={homeCol3State}
              setHomeCol3State={setHomeCol3State}
            />
          </If>
          <If condition={homeCol3State === "createChatroom"}>
            <HomeCol3CreateChatroom
              ws={ws}
              user={user}
              homeCol3State={homeCol3State}
              setHomeCol3State={setHomeCol3State}
            />
          </If>
        </Col>
      </If>
    </>
  );
};
