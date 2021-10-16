import { api_address, post } from "../../../../utils/http";

export const ChatroomsHome = ({
  user,
  userChatrooms,
  joinableChatrooms,
  searchChatrooms,
  setActiveChatroom,
  searchJoinableChatroomsCheckbox,
}) => {
  return (
    <section className="flex dash-home-chatrooms">
      <div>
        {/* korta ner detta */}
        {searchJoinableChatroomsCheckbox === false
          ? userChatrooms.map((room) => {
              return room.name.includes(searchChatrooms) ? (
                <Chatroom
                  joinable={"notJoinable"}
                  setActiveChatroom={setActiveChatroom}
                  room={room}
                  user={user}
                />
              ) : null;
            })
          : joinableChatrooms.map((room) => {
              return room.name.includes(searchChatrooms) ? (
                <Chatroom
                  joinable={"joinable"}
                  setActiveChatroom={setActiveChatroom}
                  room={room}
                  user={user}
                />
              ) : null;
            })}
      </div>
      <form action={api_address + "/create-chatroom"} method="post">
        <input type="text" name="name" id="" placeholder="chatroom name" />
        <input type="text" name="creater" id="" value={user._id} hidden />

        <button type="submit">create</button>
      </form>
    </section>
  );
};

const Chatroom = ({ joinable, room, setActiveChatroom, user }) => {
  return (
    <section
      className="col2-chatroom-con"
      onClick={() => {
        setActiveChatroom(room);
      }}
    >
      <div className="flex chatroom-con-title-fav-con">
        <h5>{room.name}</h5>
        <div className="title-fav-con-fav">O</div>
      </div>
      <div className="chatroom-con-mes">latest message</div>
      {joinable === "joinable" ? (
        <button
          onClick={async () => {
            await post(`/join-chatroom/${room._id}/${user._id}`);
          }}
        >
          join
        </button>
      ) : null}
    </section>
  );
};
