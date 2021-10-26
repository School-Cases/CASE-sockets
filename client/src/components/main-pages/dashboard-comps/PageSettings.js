import { Col, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

import { ChatroomsSettings } from "./settings/ChatroomsSettings";
import { UserSettings } from "./settings/UserSettings";
import { SearchChatrooms } from "./SearchChatrooms";
import { UserAvatar } from "./UserAvatar";
import { Nav } from "./Nav";

export const PageSettings = ({
  setSearchChatrooms,
  dashboardNavState,
  setDashboardNavState,
  searchChatrooms,
  user,
  setFetchAgain,
  fetchAgain,
  setActiveChatroom,
  activeChatroom,
  ws,
}) => {
  const [W, setW] = useState(window.innerWidth);

  useEffect(() => {
    let changeW = window.addEventListener("resize", () =>
      setW(window.innerWidth)
    );
    return window.removeEventListener("resize", changeW);
  }, [W]);

  return (
    <Row className="dashboard-con">
      <Col
        lg={{ span: 2, order: 1 }}
        md={{ span: 2, order: 1 }}
        xs={{ span: 12, order: 1 }}
        className="flex dashboard-con-col1"
      >
        <UserAvatar user={user} />
        <Nav
          setDashboardNavState={setDashboardNavState}
          dashboardNavState={dashboardNavState}
        />
      </Col>
      <Col
        lg={{ span: 6, order: 2 }}
        md={{ span: 6, order: 2 }}
        xs={{ span: 12, order: 2 }}
        className="dashboard-con-col2"
      >
        <h4>Chatrooms</h4>

        <SearchChatrooms
          setSearchChatrooms={setSearchChatrooms}
          page={dashboardNavState}
        />
        <ChatroomsSettings
          ws={ws}
          searchChatrooms={searchChatrooms}
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
          activeChatroom={activeChatroom}
          setActiveChatroom={setActiveChatroom}
        />
      </Col>
      <Col
        lg={{ span: 4, order: 3 }}
        md={{ span: 4, order: 3 }}
        xs={{ span: 12, order: 3 }}
        className="dashboard-con-col3"
      >
        <UserSettings
          user={user}
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
        />
      </Col>
    </Row>
  );
};
