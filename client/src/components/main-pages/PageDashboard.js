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
  setUser,
  activeChatroom,
  setActiveChatroom,
  allChatrooms,
  setAllChatrooms,
  userChatrooms,
  setUserChatrooms,
  joinableChatrooms,
  setJoinableChatrooms,
  fetchAgain,
  setFetchAgain,
  fetchChatrooms,
  // send,
  // message,
  // messages,
  // setMessage,
  // setMessages,
}) => {
  // const [activeChatroom, setActiveChatroom] = useState(null);
  console.log(activeChatroom);
  // const ws = new WebSocket("ws://localhost:5002");
  // const [ws, setWs] = useState(
  //   new WebSocket(
  //     "ws://localhost:5002"
  //     // "ws://localhost:5002" + "/get-chatroom/" + activeChatroom._id
  //   )
  // );
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);

  const [W, setW] = useState(window.innerWidth);
  // const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [dashboardNavState, setDashboardNavState] = useState("home");

  // chatrooms states
  // const [activeChatroom, setActiveChatroom] = useState(null);
  // const [allChatrooms, setAllChatrooms] = useState([]);
  // const [userChatrooms, setUserChatrooms] = useState([]);
  // const [joinableChatrooms, setJoinableChatrooms] = useState([]);
  const [searchChatrooms, setSearchChatrooms] = useState("");
  const [searchJoinableChatroomsCheckbox, setSearchJoinableChatroomsCheckbox] =
    useState(false);
  const [createChatroom, setCreateChatroom] = useState(false);

  // const [fetchAgain, setFetchAgain] = useState(false);

  const [fetchLastMsg, setFetchLastMsg] = useState(false);

  const [ws, setWs] = useState(null);

  // const fetchUser = async (signal) => {
  //   let res = await get(`/protected/get-user`, signal);
  //   setUser(res.data);
  //   // setFetchAgain(!fetchAgain);
  //   return fetchChatrooms(signal, res.data._id);
  // };

  // const fetchChatrooms = async (signal, userID) => {
  //   let res = await get(`/protected/get-all-chatrooms`, signal);

  //   setAllChatrooms(res.data);
  //   setUserChatrooms(
  //     res.data
  //       .filter((chat) => chat.members.includes(userID))
  //       .sort((chatA, chatB) => {
  //         return (
  //           chatB.starmarked.includes(userID) -
  //           chatA.starmarked.includes(userID)
  //         );
  //       })
  //   );
  //   setJoinableChatrooms(
  //     res.data.filter((chat) => !chat.members.includes(userID))
  //   );
  //   setLoading(false);
  // };

  // const fetchMessages = async (signal) => {
  //   let res = await get(
  //     `/protected/get-chatroom-messages/` + activeChatroom._id,
  //     signal
  //   );
  //   // setChatroomMessages(res.data);
  //   setMessages(res.data);
  //   // setLoading(false);
  // };

  useEffect(() => {
    if (!ws) setWs(new WebSocket("ws://localhost:5002"));

    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket Connected");
      };

      ws.onclose = () => {
        console.log("WebSocket Gone");
      };

      // if (user) {
      //   ws.onmessage = async (e) => {
      //     console.log(JSON.parse(e.data));

      //     // setMessage(JSON.parse(e.data));

      //     let theMessage = JSON.parse(e.data);
      //     console.log(theMessage);
      //     let res;
      //     if (user._id === theMessage.sender) {
      //       console.log("sender");
      //       res = await post(`/protected/create-message`, theMessage);
      //     }
      //     console.log(res);
      //     console.log(res.data, "msg room");
      //     // console.log(activeChatroom._id, "active room");
      //     // if (activeChatroom) {
      //     console.log(messages);
      //     const abortController = new AbortController();
      //     let result = await get(
      //       `/protected/get-chatroom/` + res.data.chatroom,
      //       abortController.signal
      //     );
      //     console.log("room", result.data);
      //     if (res.data.chatroom === result.data._id) {
      //       setMessages([...result.data.messages, res.data]);
      //       console.log("fetching all mesgs");
      //       // setFetchLastMsg(!fetchLastMsg);
      //       // }
      //     }
      //   };
      // }
    }
    setLoading(false);

    return () => {
      if (ws) ws.close();
    };
  }, [ws]);

  // useEffect(() => {
  //   if (ws) {
  //     if (user) {
  //       console.log(messages);
  //       ws.onmessage = async (e) => {
  //         console.log(JSON.parse(e.data));

  //         // setMessage(JSON.parse(e.data));

  //         let theMessage = JSON.parse(e.data);
  //         console.log(theMessage);
  //         if (user._id === theMessage.sender) {
  //           await post(`/protected/create-message`, theMessage);
  //         }

  //         if (activeChatroom)
  //           if (theMessage.chatroom === activeChatroom._id) {
  //             setMessages([...messages, theMessage]);
  //             console.log("fetching all mesgs");
  //             // setFetchLastMsg(!fetchLastMsg);
  //           }
  //       };
  //     }
  //   }
  //   // setLoading(false);
  // }, [message]);

  // useEffect(async () => {
  //   const abortController = new AbortController();
  //   await fetchUser(abortController.signal);
  //   return () => abortController.abort();
  // }, [fetchAgain, dashboardNavState]);

  // useEffect(() => {
  //   if (message && ws && ws.readyState === 1) {
  //     console.log("ok");
  //     ws.send(JSON.stringify(message));
  //   }
  // }, [message]);

  // useEffect(() => {
  //   ws.onopen = () => {
  //     console.log("WebSocket Connected");
  //   };

  //   ws.onmessage = async (e) => {
  //     const message = JSON.parse(e.data);

  //     console.log(message);
  //     if (user._id === message.sender) {
  //       await post(`/protected/create-message`, message);
  //     }

  //     if (message.chatroom === activeChatroom._id) {
  //       setMessages([...messages, message]);
  //     }
  //   };

  //   ws.onclose = () => {
  //     console.log("WebSocket Disconnected");
  //     // setWs(new WebSocket("ws://localhost:5002"));
  //   };
  // }, [ws.onmessage, ws.onopen, messages, ws.onclose]);

  useEffect(() => {
    // ****
    let changeW = window.addEventListener("resize", () =>
      setW(window.innerWidth)
    );
    return window.removeEventListener("resize", changeW);
  }, [W]);

  // useEffect(async () => {
  //   const abortController = new AbortController();
  //   if (user !== null) await fetchChatrooms(abortController.signal, user._id);
  //   return () => abortController.abort();
  // }, [fetchAgain]);

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
          setFetchAgain={setFetchAgain}
          fetchAgain={fetchAgain}
          setActiveChatroom={setActiveChatroom}
        />
      ) : (
        // <LastMsgContext.Provider value={activeChatroom}>
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
              // setFetchAgain={setFetchAgain}
              // fetchAgain={fetchAgain}
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

            {/* <LastMsgContext.Provider value={""}> */}
            <ChatroomsHome
              user={user}
              userChatrooms={userChatrooms}
              joinableChatrooms={joinableChatrooms}
              searchChatrooms={searchChatrooms}
              fetchLastMsg={fetchLastMsg}
              setFetchLastMsg={setFetchLastMsg}
              setActiveChatroom={setActiveChatroom}
              searchJoinableChatroomsCheckbox={searchJoinableChatroomsCheckbox}
              setCreateChatroom={setCreateChatroom}
            />
            {/* </LastMsgContext.Provider> */}

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
              lg={{ span: 6, order: 3 }}
              md={{ span: 6, order: 3 }}
              xs={{ span: 12, order: 3 }}
              className="dashboard-con-col3"
            >
              <Col3
                user={user}
                activeChatroom={activeChatroom}
                setActiveChatroom={setActiveChatroom}
                ws={ws}
                message={message}
                setMessage={setMessage}
                messages={messages}
                setMessages={setMessages}
                createChatroom={createChatroom}
                setCreateChatroom={setCreateChatroom}
                fetchChatrooms={fetchChatrooms}
                fetchLastMsg={fetchLastMsg}
                setFetchLastMsg={setFetchLastMsg}
                // send={send}
                // message={message}
                // setMessage={setMessage}
                // messages={messages}
                // setMessages={setMessages}
              />
            </Col>
          </If>
        </Row>
        // </LastMsgContext.Provider>
      )}
    </Container>
  );
};
