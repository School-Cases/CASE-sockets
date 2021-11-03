import { useState, useEffect } from "react";

import { post, get } from "../../../../utils/http";
import { If } from "../../../../utils/If";

export const HomeCol3CreateChatroom = ({ homeCol3State, user, ws }) => {
  // states
  const [loading, setLoading] = useState(true);

  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomTheme, setNewRoomTheme] = useState("#FA0000");
  const [newRoomMembers, setNewRoomMembers] = useState([user._id]);
  const [addableUsers, setAddableUsers] = useState([]);
  const [searchUsersInput, setSearchUsersInput] = useState("");

  // fetches
  const fetchAllUsers = async (signal) => {
    let res = await get(`/protected/get-all-users`, signal);
    setAddableUsers(res.data);
    setLoading(false);
  };

  const fetchCreateChatroom = async () => {
    let res = await post(`/protected/create-chatroom`, {
      name: newRoomName,
      admins: [user._id],
      members: newRoomMembers,
      theme: newRoomTheme,
    });
    // setCreateChatroom(false);
    // ws.send(
    //   JSON.stringify({
    //     type: "roomsUpdate",
    //   })
    // );
  };

  useEffect(async () => {
    const abortController = new AbortController();
    await fetchAllUsers(abortController.signal);
    return () => abortController.abort();
  }, []);

  if (loading) {
    <h4>loading ...</h4>;
  }

  return (
    <section className="flex height100 col3-chat-con">
      <section className="dashboard-con-create-con">
        <div className="flex create-con-top">
          <h3>Create chatroom</h3>
        </div>

        <div className="create-con-name">
          <label htmlFor="" className="create-con-text">
            Name:
          </label>

          <input
            className="create-con-input-text"
            type="text"
            name="name"
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </div>

        <div className="flex create-con-theme-color">
          <input type="text" name="theme" value={newRoomTheme} hidden />
          <div className="create-con-text">Color:</div>
          <div className="flex create-con-default-colors">
            <div
              className="create-con-green"
              onClick={() => setNewRoomTheme("#A2DC68")}
            ></div>
            <div
              className="create-con-blue"
              onClick={() => setNewRoomTheme("#68DCC4")}
            ></div>
            <div
              className="create-con-purple"
              onClick={() => setNewRoomTheme("#DC68D0")}
            ></div>
            <div
              className="create-con-yellow"
              onClick={() => setNewRoomTheme("#D8DC68")}
            ></div>
          </div>
        </div>

        <div className="flex create-con-pick-color">
          <div className="create-con-text">Pick your own:</div>
          <input
            className="create-con-color-picker"
            type="color"
            onChange={(e) => setNewRoomTheme(e.target.value)}
          />
        </div>

        <div className="create-con-add-user">
          <label className="create-con-text" htmlFor="">
            Add ppl:
          </label>
          <input
            className="create-con-input-text"
            type="text"
            placeholder="search user"
            onChange={(e) => setSearchUsersInput(e.target.value)}
          />
          <div className="flex add-user-user-container">
            <If condition={searchUsersInput !== ""}>
              {addableUsers.map((m) => {
                return (
                  <If condition={m.name.includes(searchUsersInput)}>
                    <div
                      className="flex"
                      onClick={() => {
                        !newRoomMembers.includes(m._id)
                          ? setNewRoomMembers((prev) => {
                              return [...prev, m._id];
                            })
                          : setNewRoomMembers(
                              newRoomMembers.filter((me) => me !== m._id)
                            );
                      }}
                    >
                      <div
                        className={`user-add-name ${
                          newRoomMembers.includes(m._id) ? "added" : ""
                        }`}
                      >
                        {m.name}
                      </div>
                    </div>
                  </If>
                );
              })}
            </If>
          </div>
        </div>
        <button
          className="create-con-button-create"
          onClick={() => fetchCreateChatroom()}
        >
          CREATE
        </button>
      </section>
    </section>
  );
};
