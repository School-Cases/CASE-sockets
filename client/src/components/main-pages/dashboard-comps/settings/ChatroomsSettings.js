import { useState, useEffect } from "react";
import { get, post } from "../../../../utils/http";

import { If } from "../../../../utils/If";

export const ChatroomsSettings = ({ user, userChatrooms, searchChatrooms }) => {
  const [chatSettingsToggle, setChatSettingsToggle] = useState();

  return (
    <section className="flex dash-settings-chatrooms">
      {userChatrooms.map((room) => {
        return (
          <If condition={room.name.includes(searchChatrooms)}>
            <Chatroom
              user={user}
              room={room}
              chatSettingsToggle={chatSettingsToggle}
              setChatSettingsToggle={setChatSettingsToggle}
            />
          </If>
        );
      })}
    </section>
  );
};

const Chatroom = ({
  user,
  room,
  chatSettingsToggle,
  setChatSettingsToggle,
}) => {
  const [searchUsersInput, setSearchUsersInput] = useState("");
  const [roomMembers, setRoomMembers] = useState([]);
  const [notRoomMembers, setNotRoomMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(null);

  const fetchAllUsers = async (signal) => {
    let res = await get(`/protected/get-all-users`, signal);
    setRoomMembers(res.data.filter((u) => room.members.includes(u._id)));
    setNotRoomMembers(res.data.filter((u) => !room.members.includes(u._id)));
  };

  const fetchAddUserToChatroom = async (room, m) => {
    await post(`/protected/join-chatroom/${room._id}/${m._id}`);
  };

  const fetchKickUserFromChatroom = async (room, m) => {
    await post(`/protected/leave-chatroom/${room._id}/${m._id}`);

    let newState = notRoomMembers;
    return setNotRoomMembers([...newState]);
  };

  useEffect(async () => {
    const abortController = new AbortController();
    await fetchAllUsers(abortController.signal);
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    setIsAdmin(room.admins.includes(user._id));
  }, []);

  return (
    <section
      onClick={() => {
        setChatSettingsToggle(room._id);
      }}
      className="col2-chatroom-con"
    >
      <h5>
        {room.name}
        <If condition={isAdmin}>
          <span>admin</span>
        </If>
      </h5>
      <If condition={chatSettingsToggle === room._id}>
        <p>{room.members.length} members</p>
        <div>Members:</div>
        <div className="flex">
          {roomMembers.map((m, i) => {
            return (
              <div>
                <div>{m.name}</div>
                <If condition={isAdmin && m._id !== user._id}>
                  <div onClick={() => fetchKickUserFromChatroom(room, m)}>
                    kick
                  </div>
                </If>
              </div>
            );
          })}
        </div>
        <div className="flex">
          <label>add ppl:</label>
          <input
            type="text"
            placeholder="search user"
            onChange={(e) => setSearchUsersInput(e.target.value)}
          />
        </div>
        <div>
          <If condition={searchUsersInput !== ""}>
            {notRoomMembers.map((m) => {
              return (
                <If condition={m.name.includes(searchUsersInput)}>
                  <span onClick={() => fetchAddUserToChatroom(room, m)}>
                    {m.name}
                  </span>
                </If>
              );
            })}
          </If>
        </div>

        <hr />

        <div>color:</div>
        <span>röd</span>
        <span>grön</span>
        <span>blå</span>
        <hr />
        {isAdmin ? (
          <>
            <span>icon</span> Delete chatroom
          </>
        ) : (
          <>
            <span>icon</span> Leave chatroom
          </>
        )}
      </If>
    </section>
  );
};
