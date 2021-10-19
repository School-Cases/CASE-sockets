import { api_address, get, post } from "../../utils/http";
import { Container, Col, Row } from "react-bootstrap";

import { useParams } from "react-router";

import { breakpoints } from "../../utils/breakpoints";
import { parse } from "../../utils/parse";
import { useEffect } from "react";
import { useState } from "react";

import { WS } from "../../js/ws";
import { ChatroomsHome } from "./dashboard-comps/home/ChatroomsHome";
import { ChatHome } from "./dashboard-comps/home/ChatHome";
import { ChatroomsSettings } from "./dashboard-comps/settings/ChatroomsSettings";
import { UserSettings } from "./dashboard-comps/settings/UserSettings";
import { Nav } from "./dashboard-comps/Nav";
import { UserAvatar } from "./dashboard-comps/UserAvatar";
import { SearchChatrooms } from "./dashboard-comps/SearchChatrooms";
import { PageSettings } from "./dashboard-comps/PageSettings";

export const PageDashboard = () => {
  const [ws, setWs] = useState(
    new WebSocket(
      "ws://localhost:5002"
      // "ws://localhost:5002" + "/get-chatroom/" + activeChatroom._id
    )
  );
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);

  const [W, setW] = useState(window.innerWidth);
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [dashboardNavState, setDashboardNavState] = useState("home");

  // chatrooms states
  const [activeChatroom, setActiveChatroom] = useState(null);
  const [allChatrooms, setAllChatrooms] = useState([]);
  const [userChatrooms, setUserChatrooms] = useState([]);
  const [joinableChatrooms, setJoinableChatrooms] = useState([]);
  const [searchChatrooms, setSearchChatrooms] = useState("");
  const [searchJoinableChatroomsCheckbox, setSearchJoinableChatroomsCheckbox] =
    useState(false);
  const [createChatroom, setCreateChatroom] = useState(false);

  const fetchUser = async (signal) => {
    let res = await get(`/protected/get-user`, signal);
    setUser(res.data);
    return fetchChatrooms(signal, res.data._id);
  };

  const fetchChatrooms = async (signal, userID) => {
    let res = await get(`/protected/get-all-chatrooms`, signal);

    setAllChatrooms(res.data);
    setUserChatrooms(res.data.filter((chat) => chat.members.includes(userID)));
    setJoinableChatrooms(
      res.data.filter((chat) => !chat.members.includes(userID))
    );
    setLoading(false);
  };

  const fetchMessages = async (signal) => {
    let res = await get(
      `/protected/get-chatroom-messages/` + activeChatroom._id,
      signal
    );
    // setChatroomMessages(res.data);
    setMessages(res.data);
    // setLoading(false);
  };

  const fetchCreateChatroom = async () => {
    let data = {};
    let res = await post(`/protected/create-chatroom`, data);
    // setChatroomMessages(res.data);
    // setLoading(false);
  };

  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.onmessage = async (e) => {
      const message = JSON.parse(e.data);
      console.log(message);
      if (user._id === message.sender) {
        await post(`/protected/create-message`, message);
      }

      if (message.chatroom === activeChatroom._id) {
        setMessages([...messages, message]);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setWs(new WebSocket("ws://localhost:5002"));
    };
  }, [ws.onmessage, ws.onopen, messages, ws.onclose]);

  useEffect(() => {
    // ****
    let changeW = window.addEventListener("resize", () =>
      setW(window.innerWidth)
    );
    return window.removeEventListener("resize", changeW);
  }, [W]);

  useEffect(async () => {
    const abortController = new AbortController();
    await fetchUser(abortController.signal);
    return () => abortController.abort();
  }, []);

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
          userChatrooms={userChatrooms}
          searchChatrooms={searchChatrooms}
          user={user}
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
            lg={{ span: 4, order: 2 }}
            md={{ span: 4, order: 2 }}
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
              setActiveChatroom={setActiveChatroom}
              searchJoinableChatroomsCheckbox={searchJoinableChatroomsCheckbox}
            />
            {/* <div>
              <input
                type="text"
                name="name"
                id=""
                placeholder="chatroom name"
              />
              <input type="text" name="creater" id="" value={user._id} hidden />
              
              <button type="submit" onClick={() => fetchCreateChatroom}>
                create
              </button>
            </div> */}

            <button
              onClick={() => {
                setCreateChatroom(true);
              }}
            >
              create
            </button>
          </Col>
          {W > breakpoints.medium ? (
            <Col
              lg={{ span: 6, order: 3 }}
              md={{ span: 6, order: 3 }}
              xs={{ span: 12, order: 3 }}
              className="dashboard-con-col3"
            >
              <ChatHome
                user={user}
                activeChatroom={activeChatroom}
                ws={ws}
                message={message}
                setMessage={setMessage}
                messages={messages}
                setMessages={setMessages}
                createChatroom={createChatroom}
                setCreateChatroom={setCreateChatroom}
                fetchChatrooms={fetchChatrooms}
              />
            </Col>
          ) : null}
        </Row>
      )}
    </Container>
  );
};
