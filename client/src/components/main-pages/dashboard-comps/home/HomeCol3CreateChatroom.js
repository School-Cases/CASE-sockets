import { useState, useEffect } from "react";

import { post, get } from "../../../../utils/http";
import { If } from "../../../../utils/If";

export const HomeCol3CreateChatroom = ({
  homeCol3State,
  user,
  ws,
  setChatroomUpdated,
}) => {
  // states
  const [loading, setLoading] = useState(true);

  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomTheme, setNewRoomTheme] = useState("#FA0000");
  const [newRoomAdmins, setNewRoomAdmins] = useState([user._id]);
  const [newRoomMembers, setNewRoomMembers] = useState([user]);
  // const [newRoomMembers, setNewRoomMembers] = useState([user._id]);
  // const [addableUsers, setAddableUsers] = useState([]);
  const [notRoomMembers, setNotRoomMembers] = useState([]);
  const [searchUsersInput, setSearchUsersInput] = useState("");

  const [createMessage, setCreateMessage] = useState(null);

  // fetches
  const fetchAllUsers = async (signal) => {
    let res = await get(`/protected/get-all-users`, signal);
    setNotRoomMembers(res.data);
    setLoading(false);
  };

  const fetchCreateChatroom = async () => {
    let res = await post(`/protected/create-chatroom`, {
      name: newRoomName,
      admins: newRoomAdmins,
      members: newRoomMembers,
      theme: newRoomTheme,
    });
    if (res.success) {
      setCreateMessage(res.message);
      setNewRoomName("");
      setNewRoomTheme("#FA0000");
      setNewRoomMembers([user]);
      setNewRoomAdmins([user._id]);
      // setAddableUsers([]);
      setNotRoomMembers([]);
      setSearchUsersInput("");

      ws.send(
        JSON.stringify({
          type: "chatroomCreate",
          detail: "chatroomCreate",
        })
      );
    }
  };

  useEffect(() => {
    if (createMessage) setTimeout(() => setCreateMessage(null), 4000);
  }, [createMessage]);

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
            value={newRoomName}
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

        <div className="chat-settings-text">Members:</div>
        <div className="flex chat-settings-members-container">
          {newRoomMembers.map((m, i) => {
            return (
              // <div>
              //   <div className="flex chat-settings-current-members">
              //     <div className="current-members">{m.name}</div>
              //     <If condition={newRoomAdmins.includes(m._id)}>
              //       <span>A</span>
              //     </If>
              //   </div>
              // </div>
              <div>
                <div className="flex chat-settings-current-members">
                  <div className="current-members">{m.name} </div>
                  <If condition={newRoomAdmins.includes(m._id)}>
                    <span>A</span>
                  </If>
                </div>
                <If condition={m._id !== user._id}>
                  <If condition={!newRoomAdmins.includes(m._id)}>
                    <div
                      className="chat-settings-make-admin"
                      onClick={() =>
                        setNewRoomAdmins((prev) => {
                          return [...prev, m._id];
                        })
                      }
                    >
                      adminize
                    </div>
                  </If>
                  <div
                    className="chat-settings-kick"
                    onClick={() => {
                      let newArr = newRoomMembers.filter(
                        (me) => me._id !== m._id
                      );
                      setNewRoomMembers(newArr);
                      let newArr2 = notRoomMembers;
                      if (!newArr2.includes(m)) newArr2.push(m);
                      setNotRoomMembers(newArr2);

                      let newArr3 = newRoomAdmins.filter((me) => me !== m._id);
                      setNewRoomAdmins(newArr3);
                    }}
                  >
                    kick
                  </div>
                </If>
              </div>
            );
          })}
        </div>

        <div className="create-con-add-user">
          <label className="create-con-text" htmlFor="">
            Add members:
          </label>
          <input
            className="create-con-input-text"
            type="text"
            placeholder="search user"
            value={searchUsersInput}
            onChange={(e) => setSearchUsersInput(e.target.value)}
          />
          <div className="flex add-user-user-container">
            <If condition={searchUsersInput !== ""}>
              {notRoomMembers.map((m) => {
                return (
                  <If
                    condition={
                      m.name.includes(searchUsersInput) &&
                      !newRoomMembers.includes(m) &&
                      m._id !== user._id
                    }
                  >
                    <span
                      className="chat-settings-add-member-user"
                      onClick={() =>
                        setNewRoomMembers((prev) => {
                          return [...prev, m];
                        })
                      }
                    >
                      {m.name}
                    </span>
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
        <If condition={createMessage}>
          <div>{createMessage}</div>
        </If>
      </section>
    </section>
  );
};
