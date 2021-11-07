import { useEffect, useState } from "react";

import { If } from "../../../../utils/If";
import { get, post } from "../../../../utils/http";

export const HomeCol3ChatSettings = ({
  ws,
  user,
  room,
  activeChatroom,
  setActiveChatroom,
  setChatroomUpdated,
  setChatState,
  setHomeCol3State,
  //   setUpdateMessage,
}) => {
  // states
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState(null);
  const [roomMembers, setRoomMembers] = useState([]);
  const [roomAdmins, setRoomAdmins] = useState([]);
  const [roomTheme, setRoomTheme] = useState(null);
  const [notRoomMembers, setNotRoomMembers] = useState([]);
  const [searchUsersInput, setSearchUsersInput] = useState("");

  // fetches
  const fetchAllUsers = async (signal, activeRoom) => {
    let res = await get(`/protected/get-all-users`, signal);
    setRoomMembers(
      res.data
        .filter((u) => activeRoom.members.includes(u._id))
        .sort((a, b) => {
          return (
            activeRoom.admins.includes(b._id) -
            activeRoom.admins.includes(a._id)
          );
        })
    );
    setNotRoomMembers(
      res.data.filter((u) => !activeRoom.members.includes(u._id))
    );
    setRoomAdmins(res.data.filter((u) => activeRoom.admins.includes(u._id)));
    setLoading(false);
  };

  const fetchUpdateChatroom = async (roomId) => {
    let newRoomAdmins = [];
    roomAdmins.forEach((a) => {
      newRoomAdmins.push(a._id);
    });
    let newRoomMembers = [];
    roomMembers.forEach((m) => newRoomMembers.push(m._id));
    let newRoomTheme;
    if (roomTheme === null) {
      newRoomTheme = activeChatroom.theme;
    } else {
      newRoomTheme = roomTheme;
    }
    let newRoomName;
    if (roomName === null) {
      newRoomName = activeChatroom.name;
    } else {
      newRoomName = roomName;
    }

    let res = await post(`/protected/update-chatroom/` + roomId, {
      name: newRoomName,
      admins: newRoomAdmins,
      members: newRoomMembers,
      theme: newRoomTheme,
    });
    setChatroomUpdated(true);
    setChatState(true);
    setActiveChatroom(res.data);
    // setUpdateMessage(res.message);
  };

  const fetchDeleteChatroom = async (signal, roomId) => {
    let res = await get(`/protected/delete-chatroom/` + roomId, signal);
    setChatroomUpdated(true);
    ws.send(
      JSON.stringify({
        type: "chatroomUpdate",
        detail: "userLeft",
        chatroomId: roomId,
        user: user,
      })
    );
  };

  const fetchLeaveChatroom = async (signal, roomId) => {
    let res = await post(
      `/protected/leave-chatroom/` + roomId + "/" + user._id,
      signal
    );
    setChatroomUpdated(true);
    setHomeCol3State("createChatroom");
    ws.send(
      JSON.stringify({
        type: "chatroomUpdate",
        detail: "userLeft",
        chatroomId: roomId,
        user: user,
      })
    );
  };

  // useEffects
  useEffect(async () => {
    const abortController = new AbortController();
    if (activeChatroom)
      await fetchAllUsers(abortController.signal, activeChatroom);
    return () => abortController.abort();
  }, [activeChatroom]);

  if (loading) {
    return <h2 className="">Loading...</h2>;
  }

  return (
    <>
      <If condition={room.admins.includes(user._id)}>
        <AdminChatroomSettings
          user={user}
          room={room}
          roomAdmins={roomAdmins}
          setRoomAdmins={setRoomAdmins}
          roomName={roomName}
          setRoomName={setRoomName}
          roomMembers={roomMembers}
          setRoomMembers={setRoomMembers}
          notRoomMembers={notRoomMembers}
          setNotRoomMembers={setNotRoomMembers}
          roomTheme={roomTheme}
          setRoomTheme={setRoomTheme}
          searchUsersInput={searchUsersInput}
          setSearchUsersInput={setSearchUsersInput}
          fetchDeleteChatroom={fetchDeleteChatroom}
          fetchUpdateChatroom={fetchUpdateChatroom}
        />
      </If>
      <If condition={!room.admins.includes(user._id)}>
        <MemberChatroomSettings
          user={user}
          room={room}
          roomAdmins={roomAdmins}
          roomName={roomName}
          roomMembers={roomMembers}
          setRoomMembers={setRoomMembers}
          notRoomMembers={notRoomMembers}
          setNotRoomMembers={setNotRoomMembers}
          roomTheme={roomTheme}
          setRoomTheme={setRoomTheme}
          searchUsersInput={searchUsersInput}
          setSearchUsersInput={setSearchUsersInput}
          fetchLeaveChatroom={fetchLeaveChatroom}
          fetchUpdateChatroom={fetchUpdateChatroom}
        />
      </If>
    </>
  );
};

const MemberChatroomSettings = ({
  room,
  roomAdmins,
  roomMembers,
  setRoomMembers,
  notRoomMembers,
  setNotRoomMembers,
  roomTheme,
  setRoomTheme,
  searchUsersInput,
  setSearchUsersInput,
  fetchLeaveChatroom,
  fetchUpdateChatroom,
}) => {
  return (
    <>
      <p className="chat-settings-members">{room.members.length} members</p>
      <div className="chat-settings-text">Members:</div>
      <div className="flex chat-settings-members-container">
        {roomMembers.map((m, i) => {
          return (
            <div>
              <div className="flex chat-settings-current-members">
                <div className="current-members">{m.name}</div>
                <If condition={roomAdmins.includes(m)}>
                  <span>A</span>
                </If>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex">
        <label className="chat-settings-text">add members:</label>
        <input
          className="chat-settings-input-text"
          type="text"
          placeholder="search user"
          value={searchUsersInput}
          onChange={(e) => setSearchUsersInput(e.target.value)}
        />
      </div>
      <div>
        <If condition={searchUsersInput !== ""}>
          {notRoomMembers.map((m) => {
            return (
              <If condition={m !== undefined}>
                <If
                  condition={
                    m.name.includes(searchUsersInput) &&
                    !roomMembers.includes(m)
                  }
                >
                  <span
                    className="chat-settings-add-member-user"
                    onClick={() =>
                      setRoomMembers((prev) => {
                        return [...prev, m];
                      })
                    }
                  >
                    {m.name}
                  </span>
                </If>
              </If>
            );
          })}
        </If>
      </div>

      <hr />

      <div className="chat-settings-text">Color:</div>
      <div className="flex chat-settings-default-colors">
        <div
          className={`settings-con-green ${
            roomTheme === "#A2DC68" ? "chosen-color" : ""
          }`}
          onClick={() => setRoomTheme("#A2DC68")}
        ></div>
        <div
          className={`settings-con-blue ${
            roomTheme === "#68DCC4" ? "chosen-color" : ""
          }`}
          onClick={() => setRoomTheme("#68DCC4")}
        ></div>
        <div
          className={`settings-con-purple ${
            roomTheme === "#DC68D0" ? "chosen-color" : ""
          }`}
          onClick={() => setRoomTheme("#DC68D0")}
        ></div>
        <div
          className={`settings-con-yellow ${
            roomTheme === "#D8DC68" ? "chosen-color" : ""
          }`}
          onClick={() => setRoomTheme("#D8DC68")}
        ></div>
      </div>

      <div className="flex chat-settings-color-pick">
        <div className="chat-settings-text">Pick your own:</div>
        <input
          className="chat-settings-color-picker"
          type="color"
          onChange={(e) => setRoomTheme(e.target.value)}
        />
      </div>

      <hr />
      <div
        className="chat-settings-delete"
        onClick={async () => {
          const abortController = new AbortController();
          await fetchLeaveChatroom(abortController.signal, room._id);
          return () => abortController.abort();
        }}
      >
        <span>X</span> Leave chatroom
      </div>
      <div
        className="chat-settings-save"
        onClick={() => fetchUpdateChatroom(room._id)}
      >
        SAVE
      </div>
    </>
  );
};

const AdminChatroomSettings = ({
  user,
  room,
  roomAdmins,
  setRoomAdmins,
  setRoomName,
  roomMembers,
  setRoomMembers,
  notRoomMembers,
  setNotRoomMembers,
  roomTheme,
  setRoomTheme,
  searchUsersInput,
  setSearchUsersInput,
  fetchDeleteChatroom,
  fetchUpdateChatroom,
}) => {
  return (
    <>
      <p className="chat-settings-members">{room.members.length} members</p>

      <div className="flex">
        <label className="chat-settings-text">Change name:</label>
        <input
          className="chat-settings-input-text"
          type="text"
          placeholder={room.name}
          onChange={(e) => setRoomName(e.target.value)}
        />
      </div>

      <div className="chat-settings-text">Members:</div>
      <div className="flex chat-settings-members-container">
        {roomMembers.map((m, i) => {
          return (
            <div>
              <div className="flex chat-settings-current-members">
                <div className="current-members">{m.name} </div>
                <If condition={roomAdmins.includes(m)}>
                  <span>A</span>
                </If>
              </div>
              <If condition={m._id !== user._id}>
                <If condition={!roomAdmins.includes(m)}>
                  <div
                    className="chat-settings-make-admin"
                    onClick={() =>
                      setRoomAdmins((prev) => {
                        return [...prev, m];
                      })
                    }
                  >
                    adminize
                  </div>
                </If>
                <If condition={!roomAdmins.includes(m)}>
                  <div
                    className="chat-settings-kick"
                    onClick={() => {
                      let newArr = roomMembers.filter((me) => me._id !== m._id);
                      setRoomMembers(newArr);
                      let newArr2 = notRoomMembers;
                      if (!newArr2.includes(m)) newArr2.push(m);
                      setNotRoomMembers(newArr2);
                    }}
                  >
                    kick
                  </div>
                </If>
              </If>
            </div>
          );
        })}
      </div>
      <div className="flex">
        <label className="chat-settings-text">Add member:</label>
        <input
          className="chat-settings-input-text"
          type="text"
          placeholder="search member"
          value={searchUsersInput}
          onChange={(e) => setSearchUsersInput(e.target.value)}
        />
      </div>
      <div>
        <If condition={searchUsersInput !== ""}>
          {notRoomMembers.map((m) => {
            return (
              <If condition={m !== undefined}>
                <If
                  condition={
                    m.name.includes(searchUsersInput) &&
                    !roomMembers.includes(m)
                  }
                >
                  <span
                    className="chat-settings-add-member-user"
                    onClick={() =>
                      setRoomMembers((prev) => {
                        return [...prev, m];
                      })
                    }
                  >
                    {m.name}
                  </span>
                </If>
              </If>
            );
          })}
        </If>
      </div>

      <hr />

      <div className="chat-settings-text">Color:</div>
      <div className="flex chat-settings-default-colors">
        <div
          className={`settings-con-green ${
            roomTheme === "#A2DC68" ? "chosen-color" : ""
          }`}
          onClick={() => setRoomTheme("#A2DC68")}
        ></div>
        <div
          className={`settings-con-blue ${
            roomTheme === "#68DCC4" ? "chosen-color" : ""
          }`}
          onClick={() => setRoomTheme("#68DCC4")}
        ></div>
        <div
          className={`settings-con-purple ${
            roomTheme === "#DC68D0" ? "chosen-color" : ""
          }`}
          onClick={() => setRoomTheme("#DC68D0")}
        ></div>
        <div
          className={`settings-con-yellow ${
            roomTheme === "#D8DC68" ? "chosen-color" : ""
          }`}
          onClick={() => setRoomTheme("#D8DC68")}
        ></div>
      </div>

      <div className="flex chat-settings-color-pick">
        <div className="chat-settings-text">Pick your own:</div>
        <input
          className="chat-settings-color-picker"
          type="color"
          onChange={(e) => {
            e.target.classList.add("chosen-color");
            setRoomTheme(e.target.value);
          }}
        />
      </div>

      <hr />

      <div
        className="chat-settings-delete"
        onClick={async () => {
          const abortController = new AbortController();
          await fetchDeleteChatroom(abortController.signal, room._id);
          return () => abortController.abort();
        }}
      >
        <span>X</span> Delete chatroom
      </div>
      <div
        className="chat-settings-save"
        onClick={() => fetchUpdateChatroom(room._id)}
      >
        SAVE
      </div>
    </>
  );
};

{
  /* not admin */
}
{
  /* <If condition={!room.admins.includes(user._id)}>
                  <p className="chat-settings-members">
                    {room.members.length} members
                  </p>

                  <div className="chat-settings-text">Members:</div>
                  <div className="flex chat-settings-members-container">
                    {roomMembers.map((m, i) => {
                      return (
                        <div>
                          <div className="flex chat-settings-current-members">
                            <div className="current-members">{m.name}</div>
                            <If condition={roomAdmins.includes(m)}>
                              <span>A</span>
                            </If>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex">
                    <label className="chat-settings-text">add members:</label>
                    <input
                      className="chat-settings-input-text"
                      type="text"
                      placeholder="search user"
                      value={searchUsersInput}
                      onChange={(e) => setSearchUsersInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <If condition={searchUsersInput !== ""}>
                      {notRoomMembers.map((m) => {
                        return (
                          <If condition={m !== undefined}>
                            <If
                              condition={
                                m.name.includes(searchUsersInput) &&
                                !roomMembers.includes(m)
                              }
                            >
                              <span
                                className="chat-settings-add-member-user"
                                onClick={() =>
                                  setRoomMembers((prev) => {
                                    return [...prev, m];
                                  })
                                }
                              >
                                {m.name}
                              </span>
                            </If>
                          </If>
                        );
                      })}
                    </If>
                  </div>

                  <hr />

                  <div className="chat-settings-text">color:</div>
                  <div className="flex chat-settings-default-colors">
                    <div
                      className={`settings-con-green ${
                        roomTheme === "#A2DC68" ? "chosen-color" : ""
                      }`}
                      onClick={() => setRoomTheme("#A2DC68")}
                    ></div>
                    <div
                      className={`settings-con-blue ${
                        roomTheme === "#68DCC4" ? "chosen-color" : ""
                      }`}
                      onClick={() => setRoomTheme("#68DCC4")}
                    ></div>
                    <div
                      className={`settings-con-purple ${
                        roomTheme === "#DC68D0" ? "chosen-color" : ""
                      }`}
                      onClick={() => setRoomTheme("#DC68D0")}
                    ></div>
                    <div
                      className={`settings-con-yellow ${
                        roomTheme === "#D8DC68" ? "chosen-color" : ""
                      }`}
                      onClick={() => setRoomTheme("#D8DC68")}
                    ></div>
                  </div>

                  <div className="flex chat-settings-color-pick">
                    <div className="chat-settings-text">pick:</div>
                    <input
                      className="chat-settings-color-picker"
                      type="color"
                      onChange={(e) => setRoomTheme(e.target.value)}
                    />
                  </div>

                  <hr />
                  <div
                    className="chat-settings-delete"
                    onClick={async () => {
                      const abortController = new AbortController();
                      await fetchLeaveChatroom(
                        abortController.signal,
                        room._id
                      );
                      return () => abortController.abort();
                    }}
                  >
                    <span>X</span> Leave chatroom
                  </div>
                  <div
                    className="chat-settings-save"
                    onClick={() => fetchUpdateChatroom(room._id)}
                  >
                    SAVE
                  </div>
                </If> */
}
