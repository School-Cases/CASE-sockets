export const ChatroomsSettings = ({ userChatrooms, searchChatrooms }) => {
  return (
    <section className="flex dash-settings-chatrooms">
      {userChatrooms.map((room) => {
        return room.name.includes(searchChatrooms) ? (
          <Chatroom room={room} />
        ) : null;
      })}
    </section>
  );
};

const Chatroom = ({ room }) => {
  return (
    <section className="col2-chatroom-con">
      <h5>{room.name}</h5>
    </section>
  );
};
