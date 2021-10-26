import { PageDashboard } from "./main-pages/PageDashboard";
import { useEffect, useState } from "react";
import { get } from "../utils/http";
export const Test = () => {
  // console.log("hehe2");
  // const ws = new WebSocket(
  //   "ws://localhost:5002"
  //   // "ws://localhost:5002" + "/protected/get-chatroom/" + activeChatroom._id
  // );

  // let ws;

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

  // const send = async (data) => {
  //   // console.log('send');
  //   // if (!message) return;

  //   ws.send(data);

  //   // return setMessage("");
  //   // if (messages.length !== 0) {
  //   //   setMessages([...messages, message]);
  //   // }
  //   // console.log(message);
  // };

  // useEffect(async () => {
  //   // const abortController = new AbortController();
  //   // if (activeChatroom !== null) await fetchMessages(abortController.signal);
  //   // return () => abortController.abort();
  //   if (message) await send(message);
  // }, [message]);

  // useEffect(() => {
  //   if (!ws) ws = new WebSocket("ws://localhost:5002");

  //   ws.onopen = () => {
  //     console.log("WebSocket Connected");
  //   };

  //   ws.onclose = () => {
  //     console.log("WebSocket Gone");
  //   };

  //   ws.onmessage = async (e) => {
  //     console.log(JSON.parse(e.data));

  //     // setMessage(JSON.parse(e.data));

  //     let theMessage = JSON.parse(e.data);
  //     console.log(theMessage);
  //     if (user._id === theMessage.sender) {
  //       await post(`/protected/create-message`, theMessage);
  //     }

  //     if (theMessage.chatroom === activeChatroom._id) {
  //       setMessages([...messages, theMessage]);
  //       console.log("fetching all mesgs");
  //       // setFetchLastMsg(!fetchLastMsg);
  //     }
  //   };

  //   return () => {
  //     if (ws) ws.close();
  //   };
  // }, []);

  console.log("testsida");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardNavState, setDashboardNavState] = useState("home");
  const [activeChatroom, setActiveChatroom] = useState(null);
  const [allChatrooms, setAllChatrooms] = useState([]);
  const [userChatrooms, setUserChatrooms] = useState([]);
  const [joinableChatrooms, setJoinableChatrooms] = useState([]);

  const [fetchAgain, setFetchAgain] = useState(false);

  // const [message, setMessage] = useState(null);
  // const [messages, setMessages] = useState([]);

  const fetchUser = async (signal) => {
    let res = await get(`/protected/get-user`, signal);
    setUser(res.data);
    // setFetchAgain(!fetchAgain);
    return fetchChatrooms(signal, res.data._id);
  };

  const fetchChatrooms = async (signal, userID) => {
    let res = await get(`/protected/get-all-chatrooms`, signal);
    console.log(res.data);
    setAllChatrooms(res.data);
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
    setJoinableChatrooms(
      res.data.filter((chat) => !chat.members.includes(userID))
    );

    // setActiveChatroom(
    //   res.data
    //     .filter((chat) => chat.members.includes(userID))
    //     .sort((chatA, chatB) => {
    //       return (
    //         chatB.starmarked.includes(userID) -
    //         chatA.starmarked.includes(userID)
    //       );
    //     })[0]
    // );
    setLoading(false);
  };

  useEffect(async () => {
    const abortController = new AbortController();
    await fetchUser(abortController.signal);

    return () => abortController.abort();
  }, [fetchAgain, dashboardNavState]);

  if (loading) {
    return <h2 className="">Loading...</h2>;
  }
  return (
    <PageDashboard
      user={user}
      setUser={setUser}
      activeChatroom={activeChatroom}
      setActiveChatroom={setActiveChatroom}
      allChatrooms={allChatrooms}
      setAllChatrooms={setAllChatrooms}
      userChatrooms={userChatrooms}
      setUserChatrooms={setUserChatrooms}
      joinableChatrooms={joinableChatrooms}
      setJoinableChatrooms={setJoinableChatrooms}
      allChatrooms={allChatrooms}
      setAllChatrooms={setAllChatrooms}
      userChatrooms={userChatrooms}
      setFetchAgain={setFetchAgain}
      fetchAgain={fetchAgain}
      fetchChatrooms={fetchChatrooms}
      // ws={ws}
      // send={send}
      // message={message}
      // setMessage={setMessage}
      // messages={messages}
      // setMessages={setMessages}
    />
  );
};
