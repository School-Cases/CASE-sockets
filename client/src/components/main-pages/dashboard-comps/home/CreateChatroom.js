export const CreateChatroom = ({
  setCreateChatroom,
  setNewRoomName,
  setNewRoomTheme,
  newRoomTheme,
  searchUsersInput,
  setSearchUsersInput,
  setNewRoomMembers,
  addableUsers,
  fetchCreateChatroom,
}) => {
  return (
    <section>
      <button onClick={() => setCreateChatroom(false)}>back</button>
      <h3>create a chatrum</h3>
      <input
        type="text"
        name="name"
        onChange={(e) => setNewRoomName(e.target.value)}
      />
      <input type="text" name="theme" value={newRoomTheme} />

      <div>color:</div>
      <div className="flex">
        <div onClick={() => setNewRoomTheme(0)}>röd</div>
        <div onClick={() => setNewRoomTheme(1)}>grön</div>
        <div onClick={() => setNewRoomTheme(2)}>blå</div>
        <div onClick={() => setNewRoomTheme(3)}>orange</div>
        <div onClick={() => setNewRoomTheme(4)}>svart</div>
      </div>

      <label htmlFor="">add ppl:</label>
      <input
        type="text"
        placeholder="search user"
        onChange={(e) => setSearchUsersInput(e.target.value)}
      />
      <div className="flex">
        {searchUsersInput !== ""
          ? addableUsers.map((m) => {
              return m.name.includes(searchUsersInput) ? (
                <div
                  onClick={() => {
                    setNewRoomMembers((prev) => [...prev, m._id]);
                  }}
                >
                  {m.name} <span>+</span>
                </div>
              ) : null;
            })
          : null}
      </div>
      <button onClick={() => fetchCreateChatroom()}>create it</button>
    </section>
  );
};
