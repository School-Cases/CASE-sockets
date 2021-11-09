import { useEffect, useState } from "react";

import { Col } from "react-bootstrap";

import { SettingsCol2 } from "./settings/SettingsCol2";
import { SettingsCol3 } from "./settings/SettingsCol3";

export const NavSettings = ({
  ws,
  user,
  setUserUpdated,
  userChatrooms,
  setChatroomUpdated,
}) => {
  // states
  const [W, setW] = useState(window.innerWidth);
  const [avatarSwitch, setAvatarSwitch] = useState(false);

  // useEffects
  useEffect(() => {
    let changeW = window.addEventListener("resize", () =>
      setW(window.innerWidth)
    );
    return window.removeEventListener("resize", changeW);
  }, [W]);

  return (
    <>
      <Col
        lg={{ span: avatarSwitch ? 4 : 6, order: 2 }}
        md={{ span: 6, order: 2 }}
        xs={{ span: 12, order: 2 }}
        className="dashboard-con-col2"
      >
        <SettingsCol2
          ws={ws}
          user={user}
          userChatrooms={userChatrooms}
          setChatroomUpdated={setChatroomUpdated}
          avatarSwitch={avatarSwitch}
          setAvatarSwitch={setAvatarSwitch}
        />
      </Col>
      <Col
        lg={{ span: avatarSwitch ? 6 : 4, order: 3 }}
        md={{ span: 4, order: 3 }}
        xs={{ span: 12, order: 3 }}
        className="dashboard-con-col3"
      >
        <SettingsCol3 user={user} setUserUpdated={setUserUpdated} avatarSwitch={avatarSwitch} setAvatarSwitch={setAvatarSwitch} />
      </Col>
    </>
  );
};
