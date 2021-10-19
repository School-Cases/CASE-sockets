export const SearchChatrooms = ({
  page,
  checkbox,
  setCheckbox,
  setSearchChatrooms,
}) => {
  return (
    <section className= "flex search-chatroom-con">
      <input
        type="text"
        name=""
        id=""
        placeholder="search chatrooms"
        onInput={(e) => setSearchChatrooms(e.target.value)}
      />

      {page === "home" ? (
        <div className="flex">
          <label htmlFor="searchJoinableChatroomsCheckbox">
            all:
          </label>
          <input
            type="checkbox"
            name="searchJoinableChatroomsCheckbox"
            id=""
            onChange={(e) => setCheckbox(e.target.checked)}
          />
        </div>
      ) : null}
    </section>
  );
};
