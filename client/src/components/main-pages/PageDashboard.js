// style: active chatroom home col2. gobot and byt butn. messagedetails.

// import React from "react";
import { useEffect, useState } from "react";

import { Container, Col, Row } from "react-bootstrap";

import { Nav } from "./dashboard-comps/Nav";
import { UserAvatar } from "./dashboard-comps/UserAvatar";
import { NavSettings } from "./dashboard-comps/NavSettings";
import { NavHome } from "./dashboard-comps/NavHome";

import { ws_address, get } from "../../utils/http";
import { breakpoints } from "../../utils/breakpoints";
import { If } from "../../utils/If";

export const PageDashboard = () => {
  // states
  const [loading, setLoading] = useState(true);
  const [W, setW] = useState(window.innerWidth);
  const [ws, setWs] = useState(null);

  const [userUpdated, setUserUpdated] = useState(false);

  const [user, setUser] = useState(null);
  const [userChatrooms, setUserChatrooms] = useState(null);
  const [notUserChatrooms, setNotUserChatrooms] = useState(null);
  const [usersOnline, setUsersOnline] = useState([]);
  const [navState, setNavState] = useState("home");

  // fetches
  const fetchUserAndChatrooms = async (signal) => {
    let res = await get(`/protected/get-user`, signal);
    setUser(res.data);
    // await fetchUser(signal);
    return fetchChatrooms(signal, res.data._id);
  };

  const fetchUser = async (signal) => {
    let res = await get(`/protected/get-user`, signal);
    setUser(res.data);
    setUserUpdated(false);
  };

  const fetchChatrooms = async (signal, userID) => {
    let res = await get(`/protected/get-all-chatrooms`, signal);
    setUserChatrooms(
      res.data
        .filter((chat) => chat.members.includes(userID))
        .sort((chatA, chatB) => {
          return (
            chatB.starmarked.includes(userID) -
            chatA.starmarked.includes(userID)
          );
        })
    );
    setNotUserChatrooms(
      res.data.filter((chat) => !chat.members.includes(userID))
    );
    setLoading(false);
  };

  // useEffects
  useEffect(async () => {
    if (userUpdated) {
      const abortController = new AbortController();
      await fetchUser(abortController.signal);
      return () => abortController.abort();
    }
  }, [userUpdated]);

  // useEffect(async () => {
  //   const abortController = new AbortController();
  //   await fetchChatrooms(abortController.signal);
  //   return () => abortController.abort();
  // }, []);

  useEffect(async () => {
    const abortController = new AbortController();
    await fetchUserAndChatrooms(abortController.signal);
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    let changeW = window.addEventListener("resize", () =>
      setW(window.innerWidth)
    );
    return window.removeEventListener("resize", changeW);
  }, [W]);

  useEffect(() => {
    // if (!ws) setWs(new WebSocket("ws://localhost:5002"));
    // if (!ws) setWs(new WebSocket("wss://chatwskul.herokuapp.com"));
    if (!ws && !loading) setWs(new WebSocket(ws_address + "?user=" + user._id));
    if (ws) {
      ws.onopen = () => {
        console.log("WebSocket Connected");
      };

      ws.onclose = () => {
        console.log("WebSocket Gone");
      };

      ws.onmessage = async (e) => {
        let data = JSON.parse(e.data);
        console.log(data);
        if (data === "ah ah ah stay alive!") {
          return;
        }

        if (data.type === "online") {
          console.log("online");
          console.log(data);
          setUsersOnline(data.users);
        }

        if (data.type === "offline") {
          console.log("offline");
          console.log(data);
          setUsersOnline(data.users);
        }

        // if (theMessage.type === "roomsUpdate") {
        //   setFetchAgain(!fetchAgain);
        //   const abortController = new AbortController();
        //   await fetchChatrooms(abortController.signal, user._id);
        //   return () => abortController.abort();
        // }
      };
    }
    return () => {
      if (ws) ws.close();
    };
  }, [ws, loading]);

  if (loading || !user || !ws) {
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
      <Row className="dashboard-con">
        <Col
          lg={{ span: 2, order: 1 }}
          md={{ span: 2, order: 1 }}
          xs={{ span: 12, order: 1 }}
          className="flex dashboard-con-col1"
        >
          <UserAvatar user={user} />
          <Nav navState={navState} setNavState={setNavState} />
        </Col>
        <If condition={navState === "home"}>
          <NavHome
            ws={ws}
            user={user}
            userChatrooms={userChatrooms}
            notUserChatrooms={notUserChatrooms}
            usersOnline={usersOnline}
            setUsersOnline={setUsersOnline}
          />
        </If>
        <If condition={navState === "settings"}>
          <NavSettings
            ws={ws}
            user={user}
            setUserUpdated={setUserUpdated}
            userChatrooms={userChatrooms}
          />
        </If>
      </Row>
    </Container>
  );
};
