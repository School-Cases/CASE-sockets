import { useState, useEffect } from "react";
import { get, post } from "../../../../utils/http";

export const ChatroomsSettings = ({ user, userChatrooms, searchChatrooms }) => {
  const [chatSettingsToggle, setChatSettingsToggle] = useState();

  return (
    <section className="flex dash-settings-chatrooms">
      {userChatrooms.map((room) => {
        return room.name.includes(searchChatrooms) ? (
          <Chatroom
            user={user}
            room={room}
            chatSettingsToggle={chatSettingsToggle}
            setChatSettingsToggle={setChatSettingsToggle}
          />
        ) : null;
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
    let res = await get(`/get-all-users`, signal);
    setRoomMembers(res.data.filter((u) => room.members.includes(u._id)));
    setNotRoomMembers(res.data.filter((u) => !room.members.includes(u._id)));
  };

  const fetchAddUserToChatroom = async (room, m) => {
    await post(`/join-chatroom/${room._id}/${m._id}`);
  };

  const fetchKickUserFromChatroom = async (room, m) => {
    await post(`/leave-chatroom/${room._id}/${m._id}`);

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
        {room.name} {isAdmin ? <span>admin</span> : null}
      </h5>
      {chatSettingsToggle === room._id ? (
        <div>
          <p>{room.members.length} members</p>
          <div>Members:</div>
          <div className="flex">
            {roomMembers.map((m, i) => {
              return (
                <div>
                  <div>{m.name}</div>
                  {isAdmin && m._id !== user._id ? (
                    <div onClick={() => fetchKickUserFromChatroom(room, m)}>
                      kick
                    </div>
                  ) : null}
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
            {searchUsersInput !== ""
              ? notRoomMembers.map((m) => {
                  return m.name.includes(searchUsersInput) ? (
                    <span onClick={() => fetchAddUserToChatroom(room, m)}>
                      {m.name}
                    </span>
                  ) : null;
                })
              : null}
          </div>

          <hr />
          <div>color:</div>
          <span>röd</span>
          <span>grön</span>
          <span>blå</span>
          <hr />
          {isAdmin ? (
            <div>
              <span>icon</span> Delete chatroom
            </div>
          ) : (
            <div>
              <span>icon</span> Leave chatroom
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
};
