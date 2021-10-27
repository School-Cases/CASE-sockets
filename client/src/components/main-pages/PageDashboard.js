import React from "react";

import { api_address, get, post } from "../../utils/http";
import { Container, Col, Row } from "react-bootstrap";

import { useParams } from "react-router";

import { breakpoints } from "../../utils/breakpoints";
import { parse } from "../../utils/parse";
import { useEffect } from "react";
import { useState } from "react";

import { If } from "../../utils/If";

import { WS } from "../../js/ws";
import { ChatroomsHome } from "./dashboard-comps/home/ChatroomsHome";
import { Col3 } from "./dashboard-comps/home/Col3";
import { ChatroomsSettings } from "./dashboard-comps/settings/ChatroomsSettings";
import { UserSettings } from "./dashboard-comps/settings/UserSettings";
import { Nav } from "./dashboard-comps/Nav";
import { UserAvatar } from "./dashboard-comps/UserAvatar";
import { SearchChatrooms } from "./dashboard-comps/SearchChatrooms";
import { PageSettings } from "./dashboard-comps/PageSettings";

const LastMsgContext = React.createContext("");

export const PageDashboard = ({
  user,
  // activeChatroom,
  // setActiveChatroom,
  userChatrooms,
  joinableChatrooms,
  fetchAgain,
  setFetchAgain,
  fetchChatrooms,
}) => {
  // const [message, setMessage] = useState([]);
  // const [Messages, setmessages] = useState([]);
  const [dashboardNavState, setDashboardNavState] = useState("home");
  const [W, setW] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);
  const [searchChatrooms, setSearchChatrooms] = useState("");
  const [searchJoinableChatroomsCheckbox, setSearchJoinableChatroomsCheckbox] =
    useState(false);
  const [createChatroom, setCreateChatroom] = useState(false);
  // const [fetchLastMsg, setFetchLastMsg] = useState(false);
  const [ws, setWs] = useState(null);
  const [activeChatroom, setActiveChatroom] = useState(null);

  useEffect(() => {
    // if (!ws) setWs(new WebSocket("ws://localhost:5002"));
    if (!ws) setWs(new WebSocket("wss://chatwskul.herokuapp.com"));
    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket Connected");
      };

      ws.onclose = () => {
        console.log("WebSocket Gone");
      };

      ws.onmessage = async (e) => {
        let theMessage = JSON.parse(e.data);
        console.log(theMessage);
        if (theMessage === "ah ah ah stay alive!") {
          return;
        }

        if (theMessage.type === "roomsUpdate") {
          setFetchAgain(!fetchAgain);
          const abortController = new AbortController();
          await fetchChatrooms(abortController.signal, user._id);
          return () => abortController.abort();
        }
      };
    }
    setLoading(false);
    return () => {
      if (ws) ws.close();
    };
  }, [ws]);

  useEffect(() => {
    let changeW = window.addEventListener("resize", () =>
      setW(window.innerWidth)
    );
    return window.removeEventListener("resize", changeW);
  }, [W]);

  if (loading) {
    return <h2 className="">Loading...</h2>;
  }

  return (
    <Container
      className={`page page-dashboard ${
        W < breakpoints.medium
          ? "page-dashboard-mobile"
          : "page-dashboard-desktop"
      }`}
    >
      {dashboardNavState === "settings" ? (
        <PageSettings
          setSearchChatrooms={setSearchChatrooms}
          setDashboardNavState={setDashboardNavState}
          dashboardNavState={dashboardNavState}
          searchChatrooms={searchChatrooms}
          user={user}
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
          setActiveChatroom={setActiveChatroom}
          ws={ws}
        />
      ) : (
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
              createChatroom={createChatroom}
              setCreateChatroom={setCreateChatroom}
            />
          </Col>

          <Col
            lg={{ span: 5, order: 2 }}
            md={{ span: 5, order: 2 }}
            xs={{ span: 12, order: 2 }}
            className="dashboard-con-col2"
          >
            <h4>Chatrooms</h4>

            <SearchChatrooms
              setSearchChatrooms={setSearchChatrooms}
              setCheckbox={setSearchJoinableChatroomsCheckbox}
              checkbox={searchJoinableChatroomsCheckbox}
              page={dashboardNavState}
            />

            <ChatroomsHome
              user={user}
              userChatrooms={userChatrooms}
              joinableChatrooms={joinableChatrooms}
              searchChatrooms={searchChatrooms}
              // fetchLastMsg={fetchLastMsg}
              // setFetchLastMsg={setFetchLastMsg}
              setActiveChatroom={setActiveChatroom}
              searchJoinableChatroomsCheckbox={searchJoinableChatroomsCheckbox}
              setCreateChatroom={setCreateChatroom}
              // Messages={Messages}
              // setmessages={setmessages}
              ws={ws}
            />

            <button
              onClick={() => {
                setCreateChatroom(true);
              }}
            >
              create
            </button>
          </Col>
          <If condition={W > breakpoints.medium}>
            <Col
              lg={{ span: 5, order: 3 }}
              md={{ span: 5, order: 3 }}
              xs={{ span: 12, order: 3 }}
              className="dashboard-con-col3"
            >
              <Col3
                user={user}
                activeChatroom={activeChatroom}
                setActiveChatroom={setActiveChatroom}
                ws={ws}
                // message={message}
                // setMessage={setMessage}
                // Messages={Messages}
                // setmessages={setmessages}
                createChatroom={createChatroom}
                setCreateChatroom={setCreateChatroom}
                fetchChatrooms={fetchChatrooms}
                // fetchLastMsg={fetchLastMsg}
                // setFetchLastMsg={setFetchLastMsg}
              />
            </Col>
          </If>
        </Row>
      )}
    </Container>
  );
};
