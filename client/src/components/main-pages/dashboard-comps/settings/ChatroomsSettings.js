import { useState } from "react";

export const ChatroomsSettings = ({ userChatrooms, searchChatrooms }) => {
  const [chatSettingsToggle, setChatSettingsToggle] = useState();

  return (
    <section className="flex dash-settings-chatrooms">
      {userChatrooms.map((room) => {
        return room.name.includes(searchChatrooms) ? (
          <Chatroom
            room={room}
            chatSettingsToggle={chatSettingsToggle}
            setChatSettingsToggle={setChatSettingsToggle}
          />
        ) : null;
      })}
    </section>
  );
};

const Chatroom = ({ room, chatSettingsToggle, setChatSettingsToggle }) => {
  return (
    <section
      onClick={() => {
        setChatSettingsToggle(room._id);
      }}
      className="col2-chatroom-con"
    >
      {chatSettingsToggle !== room._id ? (
        <h5>{room.name}</h5>
      ) : (
        <div>
          <h5>{room.name}</h5>
          <p>{room.members.length} members</p>
          <div>Members:</div>
          {room.members.map((m, i) => {
            console.log(m);
            return <span>avatar {i}</span>;
          })}
          <div>invite</div>
          <hr />
          <div>color:</div>
          <span>röd</span>
          <span>grön</span>
          <span>blå</span>
          <hr />
          <div>
            <span>icon</span> Leave chatroom
          </div>
        </div>
      )}
    </section>
  );
};
