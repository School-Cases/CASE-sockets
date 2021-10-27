import { PageDashboard } from "./main-pages/PageDashboard";
import { useEffect, useState } from "react";
import { get } from "../utils/http";
export const Test = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dashboardNavState, setDashboardNavState] = useState("home");
  // const [activeChatroom, setActiveChatroom] = useState(null);
  const [allChatrooms, setAllChatrooms] = useState([]);
  const [userChatrooms, setUserChatrooms] = useState([]);
  const [joinableChatrooms, setJoinableChatrooms] = useState([]);

  const [fetchAgain, setFetchAgain] = useState(false);

  const fetchUser = async (signal) => {
    let res = await get(`/protected/get-user`, signal);
    setUser(res.data);
    return fetchChatrooms(signal, res.data._id);
  };

  const fetchChatrooms = async (signal, userID) => {
    let res = await get(`/protected/get-all-chatrooms`, signal);
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
      // activeChatroom={activeChatroom}
      // setActiveChatroom={setActiveChatroom}
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
    />
  );
};
